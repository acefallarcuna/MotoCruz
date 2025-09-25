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

    if (empty($prod_id)) {
        echo json_encode(["success" => false, "message" => "Product ID is required"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("DELETE FROM prod_list WHERE prod_id = ?");
        if ($stmt === false) {
            throw new Exception("SQL query preparation failed: " . $conn->error);
        }

        $stmt->bind_param("s", $prod_id);

        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Product not found"]);
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
