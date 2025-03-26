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

// Vérifier la méthode HTTP
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

// Vérifier que l'ID est fourni
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

$id = $data['id'];

// Début d'une transaction
$pdo->beginTransaction();
$debug_log[] = "Transaction commencée";

try {
    // Vérifier si l'élève existe
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM utilisateur WHERE id = ?");
    $stmt->execute([$id]);
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
    
    // Supprimer les examens associés au candidat
    $stmt = $pdo->prepare("DELETE FROM examen WHERE id_candidat = ?");
    $stmt->execute([$id]);
    $debug_log[] = "Examens supprimés pour le candidat ID=" . $id;
    
    // Supprimer le candidat
    $stmt = $pdo->prepare("DELETE FROM candidat WHERE id_candidat = ?");
    $stmt->execute([$id]);
    $debug_log[] = "Candidat supprimé ID=" . $id;
    
    // Supprimer l'utilisateur
    $stmt = $pdo->prepare("DELETE FROM utilisateur WHERE id = ?");
    $stmt->execute([$id]);
    $debug_log[] = "Utilisateur supprimé ID=" . $id;
    
    // Valider la transaction
    $pdo->commit();
    $debug_log[] = "Transaction validée";
    
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'Élève supprimé avec succès',
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
        'message' => 'Erreur lors de la suppression de l\'élève',
        'error' => $e->getMessage(),
        'sqlError' => $e->errorInfo ?? null,
        'debug' => $debug_log
    ]);
}