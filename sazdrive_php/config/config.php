<?php
// config/config.php

// Informations de connexion à la base de données
define('DB_HOST', 'localhost');       // Hôte de la base de données
define('DB_NAME', 'sazdrive'); // Nom de la base de données
define('DB_USER', 'root');            // Nom d'utilisateur de la base de données
define('DB_PASS', '');                // Mot de passe de la base de données

// Connexion à la base de données avec PDO
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME;
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("Connexion à la base de données réussie !");
} catch (PDOException $e) {
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}
?>