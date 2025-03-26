<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $userId = $_GET['id'];
    
    try {
        // Récupérer les informations de l'utilisateur
        $sqlUser = "SELECT * FROM utilisateur WHERE id = ?";
        $stmtUser = $pdo->prepare($sqlUser);
        $stmtUser->execute([$userId]);
        $user = $stmtUser->fetch(PDO::FETCH_ASSOC);
        
        // Récupérer les informations du candidat
        $sqlCandidat = "SELECT * FROM candidat WHERE id_candidat = ?";
        $stmtCandidat = $pdo->prepare($sqlCandidat);
        $stmtCandidat->execute([$userId]);
        $candidat = $stmtCandidat->fetch(PDO::FETCH_ASSOC);
        
        $response = [
            'user' => $user,
            'candidat' => $candidat
        ];
        
        http_response_code(200);
        echo json_encode($response);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur lors de la récupération des données: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'ID utilisateur manquant']);
}
?>