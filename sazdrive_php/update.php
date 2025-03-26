<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configurer les en-têtes CORS
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once 'config/config.php'; // Inclure le fichier de configuration de la base de données

// Tableau pour stocker les logs de débogage
$debug_log = [];

// Gérer la pré-requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    $debug_log[] = "Requête OPTIONS reçue";
    http_response_code(200);
    exit();
}

// Vérifier que la méthode HTTP est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $debug_log[] = "Méthode non autorisée: " . $_SERVER['REQUEST_METHOD'];
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Méthode non autorisée', 
        'debug' => $debug_log
    ]);
    exit();
}

// Récupérer et parser les données JSON
$input = file_get_contents('php://input');
$debug_log[] = "Données reçues: " . $input;

$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    $debug_log[] = "Erreur de parsing JSON: " . json_last_error_msg();
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Données JSON invalides', 
        'error' => json_last_error_msg(),
        'debug' => $debug_log
    ]);
    exit();
}

// Vérifier que l'ID de l'élève est fourni
if (!isset($data['id']) || empty($data['id'])) {
    $debug_log[] = "ID de l'élève manquant";
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => "L'ID de l'élève est obligatoire",
        'debug' => $debug_log
    ]);
    exit();
}

// Vérifier les champs requis pour l'utilisateur
$required_fields = ['nom', 'prenom', 'email', 'mot_de_passe', 'code_neph', 'datedenaissance', 'ville', 'telephone'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        $debug_log[] = "Champ manquant: $field";
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => "Le champ '$field' est obligatoire",
            'debug' => $debug_log
        ]);
        exit();
    }
}

// Début d'une transaction
$pdo->beginTransaction();
$debug_log[] = "Transaction commencée";

try {
    // Vérifier si l'élève existe
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM utilisateur WHERE id = ?");
    $stmt->execute([$data['id']]);
    $count = $stmt->fetchColumn();
    
    if ($count === 0) {
        $debug_log[] = "Élève non trouvé";
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode([
            'success' => false, 
            'message' => 'Élève non trouvé',
            'debug' => $debug_log
        ]);
        exit();
    }
    
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM utilisateur WHERE email = ? AND id != ?");
    $stmt->execute([$data['email'], $data['id']]);
    $count = $stmt->fetchColumn();
    
    if ($count > 0) {
        $debug_log[] = "Email déjà utilisé par un autre utilisateur";
        $pdo->rollBack();
        http_response_code(409); // Conflict
        echo json_encode([
            'success' => false, 
            'message' => 'Cette adresse email est déjà utilisée par un autre utilisateur',
            'debug' => $debug_log
        ]);
        exit();
    }
    
    // 1. Mettre à jour la table utilisateur
    $debug_log[] = "Mise à jour de l'utilisateur";
    $stmt = $pdo->prepare("
        UPDATE utilisateur SET
            nom = :nom,
            prenom = :prenom,
            email = :email,
            mot_de_passe = :mot_de_passe
        WHERE id = :id
    ");
    
    $user_data = [
        'id' => $data['id'],
        'nom' => $data['nom'],
        'prenom' => $data['prenom'],
        'email' => $data['email'],
        'mot_de_passe' => $data['mot_de_passe']
    ];
    
    $stmt->execute($user_data);
    $debug_log[] = "Utilisateur mis à jour avec succès";
    
    // 2. Mettre à jour la table candidat
    $debug_log[] = "Mise à jour du candidat";
    $stmt = $pdo->prepare("
        UPDATE candidat SET
            code_neph = :code_neph,
            datedenaissance = :datedenaissance,
            ville = :ville,
            numero = :numero
        WHERE id_candidat = :id_candidat
    ");
    
    $candidat_data = [
        'id_candidat' => $data['id'],
        'code_neph' => $data['code_neph'],
        'datedenaissance' => $data['datedenaissance'],
        'ville' => $data['ville'],
        'numero' => $data['telephone']
    ];
    
    $stmt->execute($candidat_data);
    $debug_log[] = "Candidat mis à jour avec succès";
    
    // Valider la transaction
    $pdo->commit();
    $debug_log[] = "Transaction validée";
    
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'Élève mis à jour avec succès', 
        'id' => $data['id'],
        'debug' => $debug_log
    ]);
    
} catch (PDOException $e) {
    // En cas d'erreur, annuler les modifications
    $pdo->rollBack();
    $debug_log[] = "Erreur SQL: " . $e->getMessage();
    $debug_log[] = "Transaction annulée";
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur lors de la mise à jour de l\'élève',
        'error' => $e->getMessage(),
        'sqlError' => $e->errorInfo ?? null,
        'debug' => $debug_log
    ]);
}