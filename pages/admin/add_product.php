<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "motocruz";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $prodId = $_POST['prod_id'];
    $prodName = $_POST['prod_name'];
    $prodType = $_POST['prod_type'];
    $prodBrand = $_POST['prod_brand'];
    $prodStock = $_POST['prod_stock'];
    $prodPrice = $_POST['prod_price'];

    // Handle image upload
    if (isset($_FILES['prod_img']) && $_FILES['prod_img']['error'] == 0) {
        $imgTmp = $_FILES['prod_img']['tmp_name'];
        $imgExt = pathinfo($_FILES['prod_img']['name'], PATHINFO_EXTENSION);
        $imgName = $prodId . '.' . $imgExt;
        $folderName = 'prod_img';
        $imgDir = __DIR__ . '/' . $folderName;

        // Create directory if it doesn't exist
        if (!is_dir($imgDir)) {
            mkdir($imgDir, 0777, true); // recursive = true
        }

        $imgPath = $imgDir . '/' . $imgName;

        // Move uploaded file
        if (move_uploaded_file($imgTmp, $imgPath)) {
            $imgNameForDB = $folderName . '/' . $imgName;

            $sql = "INSERT INTO prod_list (prod_id, prod_img, prod_name, prod_type, prod_brand, prod_stock, prod_price)
                    VALUES ('$prodId', '$imgNameForDB', '$prodName', '$prodType', '$prodBrand', '$prodStock', '$prodPrice')";

            if ($conn->query($sql) === TRUE) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Image upload failed']);
        }
    } else {
        // Insert without image
        $sql = "INSERT INTO prod_list (prod_id, prod_name, prod_type, prod_brand, prod_stock, prod_price)
                VALUES ('$prodId', '$prodName', '$prodType', '$prodBrand', '$prodStock', '$prodPrice')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
