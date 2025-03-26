-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 26 mars 2025 à 12:08
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sazdrive`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id_admin`) VALUES
(1);

-- --------------------------------------------------------

--
-- Structure de la table `avis`
--

CREATE TABLE `avis` (
  `id_avis` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL DEFAULT 'SUPER PRÉPARATION POUR LE CODE !',
  `commentaire` text NOT NULL,
  `date_creation` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `avis`
--

INSERT INTO `avis` (`id_avis`, `id_utilisateur`, `titre`, `commentaire`, `date_creation`) VALUES
(2, 3, 'EXCELLENTE EXPÉRIENCE !', 'J\'ai beaucoup apprécié l\'accompagnement personnalisé. Les moniteurs sont très pédagogues et patients. La plateforme en ligne est intuitive et m\'a permis de bien me préparer. Je recommande vivement !', '2025-03-21 15:45:00'),
(3, 4, 'TRÈS BON SUIVI', 'L\'auto-école est très professionnelle. Le système de réservation en ligne est pratique et les instructeurs sont compétents. J\'ai obtenu mon code du premier coup grâce à leur préparation.', '2025-03-20 09:15:00'),
(4, 6, 'SUPER PRÉPARATION POUR LE CODE !', 'incroyable révision, bien coaché ! ', '2025-03-17 23:51:32'),
(6, 1, 'SUPER PRÉPARATION POUR LE CODE !', 'super !\n', '2025-03-25 17:56:38'),
(7, 4, 'SUPER PRÉPARATION POUR LE CODE !', 'j\'ai un super formateur super cool ! j\'ai eu mon permis pour moins cher avec les offres que saz\'drive propose en collab avc les auto-écoles ! ', '2025-03-25 18:03:13'),
(10, 3, 'INCROYABLE EXÉPRERIENCE', 'je recommande à 100% SAZ\'DRIVE ! ', '2025-03-26 00:04:25');

-- --------------------------------------------------------

--
-- Structure de la table `candidat`
--

CREATE TABLE `candidat` (
  `id_candidat` int(11) NOT NULL,
  `code_neph` int(11) NOT NULL,
  `datedenaissance` date NOT NULL,
  `id_simulation` int(11) NOT NULL,
  `id_test` int(11) NOT NULL,
  `ville` varchar(50) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `candidat`
--

INSERT INTO `candidat` (`id_candidat`, `code_neph`, `datedenaissance`, `id_simulation`, `id_test`, `ville`, `numero`) VALUES
(3, 1234567890, '2005-03-20', 1, 1, 'meaux', '06 20 39 45 68'),
(4, 123456789, '1995-05-15', 1, 1, 'Paris', '0611223344'),
(6, 123456789, '1995-05-15', 1, 1, 'Paris', '0611223344'),
(7, 123456789, '1990-01-01', 1, 1, 'Paris', '0600000000'),
(8, 123456789, '1990-01-01', 1, 1, 'Paris', '0600000000'),
(10, 2147483647, '2024-01-02', 1, 1, 'Meaux', '0672695546');

-- --------------------------------------------------------

--
-- Structure de la table `examen`
--

CREATE TABLE `examen` (
  `id_examen` int(11) NOT NULL,
  `id_candidat` int(11) NOT NULL,
  `date` date NOT NULL,
  `heure` time NOT NULL,
  `nom` varchar(255) NOT NULL DEFAULT 'EXAMEN BLANC CODE DE LA ROUTE',
  `note` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `examen`
--

INSERT INTO `examen` (`id_examen`, `id_candidat`, `date`, `heure`, `nom`, `note`) VALUES
(11, 3, '2024-03-10', '08:35:00', 'EXAMEN BLANC CODE DE LA ROUTE', 35),
(12, 3, '2025-03-15', '09:00:00', 'EXAMEN BLANC CODE DE LA ROUTE', 32),
(13, 3, '2025-03-12', '14:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 28),
(14, 3, '2025-03-08', '10:15:00', 'EXAMEN BLANC CODE DE LA ROUTE', 30),
(15, 3, '2025-03-05', '16:45:00', 'EXAMEN BLANC CODE DE LA ROUTE', 25),
(16, 3, '2025-03-01', '08:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 22),
(17, 3, '2025-02-25', '11:00:00', 'EXAMEN BLANC CODE DE LA ROUTE', 27),
(18, 3, '2025-02-20', '15:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 29),
(19, 3, '2025-02-15', '09:45:00', 'EXAMEN BLANC CODE DE LA ROUTE', 31),
(20, 3, '2025-02-10', '13:15:00', 'EXAMEN BLANC CODE DE LA ROUTE', 33),
(30, 3, '2025-03-15', '09:00:00', 'EXAMEN BLANC CODE DE LA ROUTE', 32),
(31, 3, '2025-03-12', '14:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 28),
(32, 3, '2025-03-08', '10:15:00', 'EXAMEN BLANC CODE DE LA ROUTE', 30),
(33, 3, '2025-03-05', '16:45:00', 'EXAMEN BLANC CODE DE LA ROUTE', 25),
(34, 3, '2025-03-01', '08:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 22),
(35, 3, '2025-02-25', '11:00:00', 'EXAMEN BLANC CODE DE LA ROUTE', 27),
(36, 3, '2025-02-20', '15:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 29),
(37, 3, '2025-02-15', '09:45:00', 'EXAMEN BLANC CODE DE LA ROUTE', 31),
(38, 3, '2025-02-10', '13:15:00', 'EXAMEN BLANC CODE DE LA ROUTE', 33),
(48, 3, '2025-03-15', '09:00:00', 'EXAMEN BLANC CODE DE LA ROUTE', 32),
(49, 3, '2025-03-12', '14:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 28),
(50, 3, '2025-03-08', '10:15:00', 'EXAMEN BLANC CODE DE LA ROUTE', 30),
(51, 3, '2025-03-05', '16:45:00', 'EXAMEN BLANC CODE DE LA ROUTE', 25),
(52, 3, '2025-03-01', '08:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 22),
(53, 3, '2025-02-25', '11:00:00', 'EXAMEN BLANC CODE DE LA ROUTE', 27),
(54, 3, '2025-02-20', '15:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 29),
(55, 3, '2025-02-15', '09:45:00', 'EXAMEN BLANC CODE DE LA ROUTE', 31),
(56, 3, '2025-02-10', '13:15:00', 'EXAMEN BLANC CODE DE LA ROUTE', 33),
(57, 4, '2025-03-16', '10:00:00', 'EXAMEN BLANC CODE DE LA ROUTE', 38),
(58, 4, '2025-03-13', '15:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 36),
(59, 4, '2025-03-09', '11:15:00', 'EXAMEN BLANC CODE DE LA ROUTE', 37),
(60, 4, '2025-03-06', '14:45:00', 'EXAMEN BLANC CODE DE LA ROUTE', 35),
(61, 4, '2025-03-02', '09:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 32),
(62, 4, '2025-02-26', '12:00:00', 'EXAMEN BLANC CODE DE LA ROUTE', 33),
(63, 4, '2025-02-21', '16:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 34),
(64, 4, '2025-02-16', '10:45:00', 'EXAMEN BLANC CODE DE LA ROUTE', 36),
(65, 4, '2025-02-11', '14:15:00', 'EXAMEN BLANC CODE DE LA ROUTE', 38),
(75, 6, '2025-03-16', '13:15:00', 'EXAMEN BLANC CODE DE LA ROUTE', 27),
(76, 6, '2025-03-13', '16:45:00', 'EXAMEN BLANC CODE DE LA ROUTE', 29),
(77, 8, '2025-03-14', '11:30:00', 'EXAMEN BLANC CODE DE LA ROUTE', 31),
(78, 8, '2025-03-11', '14:00:00', 'EXAMEN BLANC CODE DE LA ROUTE', 33);

-- --------------------------------------------------------

--
-- Structure de la table `simulation`
--

CREATE TABLE `simulation` (
  `id_simulation` int(11) NOT NULL,
  `titre_simulation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `simulation`
--

INSERT INTO `simulation` (`id_simulation`, `titre_simulation`) VALUES
(1, 'Simulation permis ');

-- --------------------------------------------------------

--
-- Structure de la table `test`
--

CREATE TABLE `test` (
  `id_test` int(11) NOT NULL,
  `titre_test` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `test`
--

INSERT INTO `test` (`id_test`, `titre_test`) VALUES
(1, 'Examen code de la route');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `role` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `role`, `email`, `nom`, `prenom`, `mot_de_passe`) VALUES
(1, 'admin', 'admin@test.com', 'Doe', 'John', 'test123'),
(3, 'eleve', 'julie@gmail.com', 'Demari', 'Julie', 'test123'),
(4, 'eleve', 'abi@test.com', 'mmi', 'abi', 'test123'),
(6, 'eleve', 'zeinabou@test.com', 'mmi', 'zeinabou', 'test123'),
(8, 'eleve', 'jeandupont@example.com', 'Dupont', 'Jean', 'test123'),
(10, 'eleve', 'test1@test.com', 'test', 'test', 'test123');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Index pour la table `avis`
--
ALTER TABLE `avis`
  ADD PRIMARY KEY (`id_avis`),
  ADD KEY `fk_avis_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `candidat`
--
ALTER TABLE `candidat`
  ADD PRIMARY KEY (`id_candidat`),
  ADD KEY `id_simulation` (`id_simulation`),
  ADD KEY `id_test` (`id_test`);

--
-- Index pour la table `examen`
--
ALTER TABLE `examen`
  ADD PRIMARY KEY (`id_examen`),
  ADD KEY `id_candidat` (`id_candidat`);

--
-- Index pour la table `simulation`
--
ALTER TABLE `simulation`
  ADD PRIMARY KEY (`id_simulation`);

--
-- Index pour la table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`id_test`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `avis`
--
ALTER TABLE `avis`
  MODIFY `id_avis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `examen`
--
ALTER TABLE `examen`
  MODIFY `id_examen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `avis`
--
ALTER TABLE `avis`
  ADD CONSTRAINT `fk_avis_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `examen`
--
ALTER TABLE `examen`
  ADD CONSTRAINT `examen_ibfk_1` FOREIGN KEY (`id_candidat`) REFERENCES `candidat` (`id_candidat`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
