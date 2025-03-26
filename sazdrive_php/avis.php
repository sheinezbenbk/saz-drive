<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Récupérer tous les avis avec les informations des utilisateurs
        $sql = "SELECT a.id_avis, a.titre, a.commentaire, a.date_creation, 
                       u.id as id_utilisateur, u.nom, u.prenom 
                FROM avis a 
                JOIN utilisateur u ON a.id_utilisateur = u.id 
                ORDER BY a.date_creation DESC";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $avis = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Retourner les données au format JSON
        http_response_code(200);
        echo json_encode($avis);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Erreur lors de la récupération des avis: ' . $e->getMessage()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Récupérer et parser les données
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Vérifier que les champs obligatoires sont présents
        if (!isset($input['id_utilisateur']) || !isset($input['commentaire'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Données manquantes. ID utilisateur et commentaire sont requis.'
            ]);
            exit();
        }
        
        // Insérer le nouvel avis
        $stmt = $pdo->prepare("
            INSERT INTO avis (id_utilisateur, commentaire, titre, date_creation)
            VALUES (:id_utilisateur, :commentaire, :titre, NOW())
        ");
        
        $stmt->execute([
            'id_utilisateur' => $input['id_utilisateur'],
            'commentaire' => $input['commentaire'],
            'titre' => $input['titre'] ?? 'SUPER PRÉPARATION POUR LE CODE !'
        ]);
        
        $id_avis = $pdo->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Avis ajouté avec succès',
            'id' => $id_avis
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de l\'ajout de l\'avis: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'message' => 'Méthode non autorisée'
    ]);
}