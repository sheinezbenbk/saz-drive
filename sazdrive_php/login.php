<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'config/config.php'; // Inclure le fichier de configuration de la base de données

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Log des données reçues
    error_log("Données reçues : " . print_r($data, true));

    $email = $data['email'];
    $mot_de_passe = $data['mot_de_passe'];

    $sql = "SELECT * FROM utilisateur WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Log de l'utilisateur trouvé
    error_log("Utilisateur trouvé : " . print_r($user, true));

    if ($user && $mot_de_passe === $user['mot_de_passe']) {
        http_response_code(200);
        echo json_encode([
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role'], 
                'nom' => $user['nom'] ?? '',
                'prenom' => $user['prenom'] ?? '',
                'code_neph' => $candidat['code_neph'] ?? '',
                'datedenaissance' => $candidat['datedenaissance'] ?? '',
                'numero' => $candidat['numero'] ?? '', 
                'ville' => $candidat['ville'] ?? '', 
          
           
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Email ou mot de passe incorrect']);
    }
}
?>