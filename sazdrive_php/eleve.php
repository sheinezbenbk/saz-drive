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
        // Vérifier si un ID est spécifié dans l'URL
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            
            // Récupérer les informations de l'utilisateur
            $sqlUser = "SELECT * FROM utilisateur WHERE id = ? AND role = 'eleve'";
            $stmtUser = $pdo->prepare($sqlUser);
            $stmtUser->execute([$id]);
            $user = $stmtUser->fetch(PDO::FETCH_ASSOC);
            
            if (!$user) {
                http_response_code(404);
                echo json_encode(['message' => 'Élève non trouvé']);
                exit;
            }
            
            // Récupérer les informations du candidat
            $sqlCandidat = "SELECT * FROM candidat WHERE id_candidat = ?";
            $stmtCandidat = $pdo->prepare($sqlCandidat);
            $stmtCandidat->execute([$id]);
            $candidat = $stmtCandidat->fetch(PDO::FETCH_ASSOC);
            
            // Récupérer les examens de l'élève
            // $sqlExamens = "SELECT * FROM examen WHERE id_candidat = ? ORDER BY date DESC, heure DESC";
            // $stmtExamens = $pdo->prepare($sqlExamens);
            // $stmtExamens->execute([$id]);
            // $examens = $stmtExamens->fetchAll(PDO::FETCH_ASSOC);
            
            // Formater les examens pour l'affichage
            // $examensFormates = [];
            // foreach ($examens as $examen) {
            //     // Convertir la date au format "Lun, 10 Mars"
            //     $dateObj = new DateTime($examen['date']);
            //     $jourSemaine = $dateObj->format('D');
            //     $jour = $dateObj->format('d');
            //     $mois = $dateObj->format('M');
                
                // Traduire en français
                // $joursFR = ['Mon' => 'Lun', 'Tue' => 'Mar', 'Wed' => 'Mer', 'Thu' => 'Jeu', 'Fri' => 'Ven', 'Sat' => 'Sam', 'Sun' => 'Dim'];
                // $moisFR = ['Jan' => 'Jan', 'Feb' => 'Fév', 'Mar' => 'Mars', 'Apr' => 'Avr', 'May' => 'Mai', 'Jun' => 'Juin', 'Jul' => 'Juil', 'Aug' => 'Août', 'Sep' => 'Sept', 'Oct' => 'Oct', 'Nov' => 'Nov', 'Dec' => 'Déc'];
                
                // $jourFR = $joursFR[$jourSemaine] ?? $jourSemaine;
                // $moisFR = $moisFR[$mois] ?? $mois;
                
                // Formater l'heure (HH:MM)
            //     $heureObj = new DateTime($examen['heure']);
            //     $heureFormatee = $heureObj->format('H:i');
                
            //     $examensFormates[] = [
            //         'id' => $examen['id_examen'],
            //         'date' => "$jourFR, $jour $moisFR",
            //         'heure' => $heureFormatee,
            //         'nom' => $examen['nom'],
            //         'note' => $examen['note']
            //     ];
            // }
            
            // Dernier examen pour les résultats d'admission
            // $dernierExamen = null;
            // if (count($examensFormates) > 0) {
            //     $dernierExamen = [
            //         'note' => $examensFormates[0]['note'],
            //         'pourcentage' => ($examensFormates[0]['note'] / 40) * 100
            //     ];
            // }
            
            // Déterminer le statut
            $statut = 'NON ADMIS';
            if ($dernierExamen && $dernierExamen['pourcentage'] >= 80) {
                $statut = 'ADMIS';
            }
            
            // Construire la réponse
            $eleve = [
                'id' => $user['id'],
                'nom' => $user['nom'] ?? 'Nom non défini',
                'prenom' => $user['prenom'] ?? 'Prénom non défini',
                'email' => $user['email'] ?? '',
                'telephone' => $candidat['telephone'] ?? '',
                'datedenaissance' => $candidat['datedenaissance'] ?? '',
                'ville' => $candidat['ville'] ?? '',
                'numero' => $candidat['numero'] ?? '',
                'code_neph' => $candidat['code_neph'] ?? '',
                'statut' => $statut,
                // 'examens' => $examensFormates,
                // 'dernierExamen' => $dernierExamen
            ];
            
            http_response_code(200);
            echo json_encode($eleve);
        } else {
            // Récupérer tous les utilisateurs avec le rôle "eleve"
            $sql = "SELECT * FROM utilisateur WHERE role = 'eleve'";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $eleves = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Transformer les données pour qu'elles correspondent au format attendu par le frontend
            $resultats = [];
            foreach ($eleves as $eleve) {
                // Pour chaque élève, récupérer les infos candidat si elles existent
                $sqlCandidat = "SELECT * FROM candidat WHERE id_candidat = ?";
                $stmtCandidat = $pdo->prepare($sqlCandidat);
                $stmtCandidat->execute([$eleve['id']]);
                $candidat = $stmtCandidat->fetch(PDO::FETCH_ASSOC);
                
                // Récupérer le dernier examen pour déterminer le statut
                $sqlExamen = "SELECT * FROM examen WHERE id_candidat = ? ORDER BY date DESC, heure DESC LIMIT 1";
                $stmtExamen = $pdo->prepare($sqlExamen);
                $stmtExamen->execute([$eleve['id']]);
                $dernierExamen = $stmtExamen->fetch(PDO::FETCH_ASSOC);
                
                $statut = 'NON ADMIS';
                if ($dernierExamen && ($dernierExamen['note'] / 40) * 100 >= 80) {
                    $statut = 'ADMIS';
                }
                
                $resultat = [
                    'id' => $eleve['id'],
                    'nom' => $eleve['nom'] ?? 'Nom non défini',
                    'prenom' => $eleve['prenom'] ?? 'Prénom non défini',
                    'photo' => $eleve['photo'] ?? 'image/pdphomme.png',
                    'code_neph' => $candidat['code_neph'] ?? '',
                    'datedenaissance' => $candidat['datedenaissance'] ?? '',
                    'ville' => $candidat['ville'] ?? '',
                    'numero' => $candidat['numero'] ?? '',
                    'statut' => $statut
                ];
                
                $resultats[] = $resultat;
            }
            
            // Retourner les données au format JSON
            http_response_code(200);
            echo json_encode($resultats);
        }
    } catch (PDOException $e) {
        // En cas d'erreur avec la base de données
        http_response_code(500);
        echo json_encode([
            'message' => 'Erreur lors de la récupération des élèves: ' . $e->getMessage()
        ]);
    }
} else {
    // Si la méthode HTTP n'est pas GET
    http_response_code(405);
    echo json_encode([
        'message' => 'Méthode non autorisée'
    ]);
}
?>