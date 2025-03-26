<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once 'config/config.php';

// Gérer la pré-requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// S'assurer que la méthode HTTP est DELETE ou POST
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Récupérer l'ID de l'avis à supprimer
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Vérifier si l'ID est présent dans l'URL ou dans le corps de la requête
    if (isset($_GET['id'])) {
        $id_avis = $_GET['id'];
    } elseif (isset($input['id'])) {
        $id_avis = $input['id'];
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'ID de l\'avis manquant'
        ]);
        exit();
    }
    
    try {
        // Supprimer l'avis de la base de données
        $stmt = $pdo->prepare("DELETE FROM avis WHERE id_avis = ?");
        $stmt->execute([$id_avis]);
        
        // Vérifier si la suppression a réussi
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Avis supprimé avec succès'
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Aucun avis trouvé avec cet ID'
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de la suppression de l\'avis: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
}