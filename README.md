# Task API 🔗

Projet transversal : une API REST en PHP consommée par un frontend JavaScript.

## Architecture

Task-api/
backend/     API PHP (config.php, api.php)
frontend/    Interface JS (index.html, style.css, script.js)

## Fonctionnalités
- Lister les tâches (GET)
- Ajouter une tâche (POST)
- Supprimer une tâche (DELETE)
- Communication front/back via fetch et JSON

## Prérequis
- WampServer (ou équivalent PHP + MySQL)

## Installation

1. Cloner le dépôt dans le dossier www de votre serveur local :

git clone https://github.com/yodaghaniyou-afk/task-api.git

2. Créer la base de données et la table dans phpMyAdmin :

CREATE DATABASE task_api_db;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    terminee BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

3. Ouvrir dans le navigateur :

http://localhost/task-api/frontend/index.html

## Endpoints de l'API

| Méthode | URL | Description |
|---|---|---|
| GET | backend/api.php | Liste toutes les tâches |
| POST | backend/api.php | Ajoute une tâche (body JSON: titre) |
| DELETE | backend/api.php?id=X | Supprime la tâche X |

## Technologies utilisées
- PHP 8 (PDO, API REST, CORS)
- MySQL
- JavaScript (fetch, async/await)
- HTML / CSS