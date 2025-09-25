<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "motocruz";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $prod_id = $_POST['prod_id'];
    $prod_name = $_POST['prod_name'];
    $prod_type = $_POST['prod_type'];
    $prod_brand = $_POST['prod_brand'];
    $prod_stock = $_POST['prod_stock'];
    $prod_price = $_POST['prod_price'];

    $prod_img = null;
    if (isset($_FILES['prod_img']) && $_FILES['prod_img']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'prod_img/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $prod_img = $uploadDir . basename($_FILES['prod_img']['name']);
        move_uploaded_file($_FILES['prod_img']['tmp_name'], $prod_img);
    }

    $updateQuery = "UPDATE prod_list SET prod_name = ?, prod_type = ?, prod_brand = ?, prod_stock = ?, prod_price = ?";
    $params = [$prod_name, $prod_type, $prod_brand, $prod_stock, $prod_price];
    $types = 'sssss';

    if ($prod_img) {
        $updateQuery .= ", prod_img = ?";
        $params[] = $prod_img;
        $types .= 's';
    }

    $updateQuery .= " WHERE prod_id = ?";
    $params[] = $prod_id;
    $types .= 'i';

    $stmt = $conn->prepare($updateQuery);
    if ($stmt === false) {
        throw new Exception("SQL query preparation failed: " . $conn->error);
    }

    $stmt->bind_param($types, ...$params);

    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "No changes made or product not found"]);
    }

    $stmt->close();
    $conn->close();
}
?>