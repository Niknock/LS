<?php
header('Content-Type: application/json');

$action = $_GET['action'];
$file = $_GET['file'];

if ($file !== 'kunden' && $file !== 'felder') {
    echo json_encode(["error" => "Invalid file specified."]);
    exit;
}

$filename = $file . '.json';

if ($action == 'get') {
    if (file_exists($filename)) {
        echo file_get_contents($filename);
    } else {
        echo json_encode([]);
    }
} elseif ($action == 'save') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data) {
        file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Invalid data provided."]);
    }
}
?>
