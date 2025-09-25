<?php
header('Content-Type: application/json');

require_once __DIR__ . '/_config/_connection.php';

if ($mysqli->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$types = [];
$brands = [];

$typeResult = $mysqli->query("SELECT DISTINCT prod_type FROM prod_list");
if ($typeResult) {
    while ($row = $typeResult->fetch_assoc()) {
        $types[] = $row['prod_type'];
    }
}

$brandResult = $mysqli->query("SELECT DISTINCT prod_brand FROM prod_list");
if ($brandResult) {
    while ($row = $brandResult->fetch_assoc()) {
        $brands[] = $row['prod_brand'];
    }
}

echo json_encode([
    'success' => true,
    'types' => $types,
    'brands' => $brands
]);

$mysqli->close();
