<?php
// examens.php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['message' => 'ID de l\'élève manquant']);
            exit;
        }

        $id = $_GET['id'];
        
        // Récupérer les examens de l'élève
        $sql = "SELECT id_examen, date, heure, nom, note FROM examen 
                WHERE id_candidat = ? 
                ORDER BY date DESC, heure DESC 
                LIMIT 10";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $examens = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Formater les examens pour l'affichage
        $examensFormates = [];
        foreach ($examens as $examen) {
            // Convertir la date au format "Lun, 10 Mars"
            $dateObj = new DateTime($examen['date']);
            $jourSemaine = $dateObj->format('D');
            $jour = $dateObj->format('d');
            $mois = $dateObj->format('M');
            
            // Traduire en français
            $joursFR = ['Mon' => 'Lun', 'Tue' => 'Mar', 'Wed' => 'Mer', 'Thu' => 'Jeu', 'Fri' => 'Ven', 'Sat' => 'Sam', 'Sun' => 'Dim'];
            $moisFR = ['Jan' => 'Jan', 'Feb' => 'Fév', 'Mar' => 'Mars', 'Apr' => 'Avr', 'May' => 'Mai', 'Jun' => 'Juin', 'Jul' => 'Juil', 'Aug' => 'Août', 'Sep' => 'Sept', 'Oct' => 'Oct', 'Nov' => 'Nov', 'Dec' => 'Déc'];
            
            $jourFR = $joursFR[$jourSemaine] ?? $jourSemaine;
            $moisFR = $moisFR[$mois] ?? $mois;
            
            // Formater l'heure (HH:MM)
            $heureObj = new DateTime($examen['heure']);
            $heureFormatee = $heureObj->format('H:i');
            
            $examensFormates[] = [
                'id' => $examen['id_examen'],
                'dateFormatee' => "$jourFR, $jour $moisFR",
                'heureFormatee' => $heureFormatee,
                'nom' => $examen['nom'],
                'note' => $examen['note']
            ];
        }
        
        // Calculer des statistiques
        $stats = [
            'dernierExamen' => $examensFormates[0] ?? null,
            'moyenne' => 0,
            'pourcentage' => 0,
            'reussite' => false
        ];
        
        if (count($examensFormates) > 0) {
            $totalNotes = array_sum(array_column($examens, 'note'));
            $stats['moyenne'] = $totalNotes / count($examens);
            $stats['pourcentage'] = ($stats['moyenne'] / 40) * 100;
            $stats['reussite'] = $stats['pourcentage'] >= 80;
        }
        
        // Retourner le résultat
        http_response_code(200);
        echo json_encode([
            'examens' => $examensFormates,
            'stats' => $stats
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Erreur lors de la récupération des examens: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'message' => 'Méthode non autorisée'
    ]);
}