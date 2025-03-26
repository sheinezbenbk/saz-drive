<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configurer les en-têtes CORS
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once 'config/config.php'; // Inclure le fichier de configuration de la base de données

// Initialiser le tableau de débogage
$debug_log = [];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    $debug_log[] = "Requête OPTIONS reçue";
    http_response_code(200);
    exit();
}

// Vérifier la méthode de requête
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

// Récupérer et parser les données
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

// Vérifier les champs requis pour l'utilisateur
$required_fields_utilisateur = ['nom', 'prenom', 'email', 'mot_de_passe', 'role'];
foreach ($required_fields_utilisateur as $field) {
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

// Vérifier les champs requis pour le candidat
$required_fields_candidat = ['code_neph', 'datedenaissance', 'ville', 'telephone'];
foreach ($required_fields_candidat as $field) {
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
    // Vérifier si l'email existe déjà
    $debug_log[] = "Vérification de l'email: " . $data['email'];
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM utilisateur WHERE email = ?");
    $stmt->execute([$data['email']]);
    $count = $stmt->fetchColumn();
    
    if ($count > 0) {
        $debug_log[] = "Email déjà utilisé";
        $pdo->rollBack();
        http_response_code(409); // Conflict
        echo json_encode([
            'success' => false, 
            'message' => 'Cette adresse email est déjà utilisée',
            'debug' => $debug_log
        ]);
        exit();
    }

    // 1. Insérer dans la table utilisateur
    $debug_log[] = "Préparation insertion utilisateur";
    $stmt = $pdo->prepare("
        INSERT INTO utilisateur (
            nom, prenom, email, mot_de_passe, role
        ) VALUES (
            :nom, :prenom, :email, :mot_de_passe, :role
        )
    ");
    
    // Données pour utilisateur
    $user_data = [
        'nom' => $data['nom'],
        'prenom' => $data['prenom'],
        'email' => $data['email'],
        'mot_de_passe' => $data['mot_de_passe'], // En production, hasher le mot de passe
        'role' => 'eleve'
    ];
    $debug_log[] = "Données utilisateur: " . json_encode($user_data);
    
    // Exécuter l'insertion utilisateur
    $stmt->execute($user_data);
    $id_utilisateur = $pdo->lastInsertId();
    $debug_log[] = "Utilisateur inséré avec ID: " . $id_utilisateur;
    
    // 2. Insérer dans la table candidat
    $debug_log[] = "Préparation insertion candidat";
    $stmt = $pdo->prepare("
        INSERT INTO candidat (
            id_candidat, code_neph, datedenaissance, ville, numero, id_simulation, id_test
        ) VALUES (
            :id_candidat, :code_neph, :datedenaissance, :ville, :numero, :id_simulation, :id_test
        )
    ");
    
    // Données pour candidat
    $candidat_data = [
        'id_candidat' => $id_utilisateur,
        'code_neph' => $data['code_neph'],
        'datedenaissance' => $data['datedenaissance'],
        'ville' => $data['ville'],
        'numero' => $data['telephone'],
        'id_simulation' => 1, // Valeur par défaut
        'id_test' => 1 // Valeur par défaut
    ];
    $debug_log[] = "Données candidat: " . json_encode($candidat_data);
    
    // Exécuter l'insertion candidat
    $stmt->execute($candidat_data);
    $debug_log[] = "Candidat inséré avec succès";
    
    // Tout s'est bien passé, on valide la transaction
    $pdo->commit();
    $debug_log[] = "Transaction validée";
    
    http_response_code(201); // Created
    echo json_encode([
        'success' => true, 
        'message' => 'Élève ajouté avec succès', 
        'id' => $id_utilisateur,
        'debug' => $debug_log
    ]);
    
} catch (PDOException $e) {
    // En cas d'erreur, on annule toutes les modifications
    $pdo->rollBack();
    $debug_log[] = "Erreur SQL: " . $e->getMessage();
    $debug_log[] = "Transaction annulée";
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur lors de l\'ajout de l\'élève',
        'error' => $e->getMessage(),
        'sqlError' => $e->errorInfo ?? null,
        'debug' => $debug_log
    ]);
}