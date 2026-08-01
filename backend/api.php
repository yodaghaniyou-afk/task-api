<?php
require_once "config.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$methode = $_SERVER["REQUEST_METHOD"];

switch ($methode) {
    case "GET":
        $stmt = $pdo->query("SELECT * FROM tasks ORDER BY date_creation DESC");
        $taches = $stmt->fetchAll(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode($taches);
        break;

    case "POST":
        $donnees = json_decode(file_get_contents("php://input"), true);
        $titre = trim($donnees["titre"] ?? "");

        if ($titre === "") {
            http_response_code(400);
            echo json_encode(["erreur" => "Le titre est requis."]);
            break;
        }

        if (mb_strlen($titre) > 255) {
            http_response_code(400);
            echo json_encode(["erreur" => "Le titre ne doit pas dépasser 255 caractères."]);
            break;
        }

        $stmt = $pdo->prepare("INSERT INTO tasks (titre) VALUES (:titre)");
        $stmt->execute(["titre" => $titre]);

        http_response_code(201);
        echo json_encode(["succes" => true, "id" => $pdo->lastInsertId()]);
        break;

    case "PATCH":
        $id = (int) ($_GET["id"] ?? 0);

        if ($id === 0) {
            http_response_code(400);
            echo json_encode(["erreur" => "ID manquant."]);
            break;
        }

        $verif = $pdo->prepare("SELECT id FROM tasks WHERE id = :id");
        $verif->execute(["id" => $id]);
        if (!$verif->fetch()) {
            http_response_code(404);
            echo json_encode(["erreur" => "Tâche introuvable."]);
            break;
        }

        $donnees = json_decode(file_get_contents("php://input"), true);
        $terminee = $donnees["terminee"] ?? true;

        $stmt = $pdo->prepare("UPDATE tasks SET terminee = :terminee WHERE id = :id");
        $stmt->execute(["terminee" => $terminee, "id" => $id]);

        http_response_code(200);
        echo json_encode(["succes" => true]);
        break;

    case "DELETE":
        $id = (int) ($_GET["id"] ?? 0);

        if ($id === 0) {
            http_response_code(400);
            echo json_encode(["erreur" => "ID manquant."]);
            break;
        }

        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
        $stmt->execute(["id" => $id]);

        http_response_code(200);
        echo json_encode(["succes" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["erreur" => "Méthode non autorisée."]);
}
?>