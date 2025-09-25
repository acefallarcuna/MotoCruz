<?php
require_once '_config/_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['cart'])) {
    echo json_encode(["success" => false, "message" => "Cart is empty"]);
    exit;
}

$cart = $data['cart'];
$date_purchased = date("Y-m-d H:i:s");
$transaction_id = uniqid("TXN_");

$mysqli->begin_transaction();

try {
    $insertRecordStmt = $mysqli->prepare("
        INSERT INTO records
        (transaction_id, prod_id, prod_img, prod_name, prod_type, prod_brand, prod_price, quantity, total_price, date_purchased)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $updateStockStmt = $mysqli->prepare("
        UPDATE prod_list SET prod_stock = prod_stock - ? WHERE prod_id = ? AND prod_stock >= ?
    ");

    if (!$insertRecordStmt || !$updateStockStmt) {
        throw new Exception("Database prepare error: ".$mysqli->error);
    }

    foreach ($cart as $item) {
        $prod_id = $item['id'];
        $prod_img = $item['img'];
        $prod_name = $item['name'];
        $prod_type = $item['type'];
        $prod_brand = $item['brand'];
        $prod_price = $item['price'];
        $qty = $item['qty'];
        $total_price = $prod_price * $qty;

        $updateStockStmt->bind_param("iii", $qty, $prod_id, $qty);
        $updateStockStmt->execute();

        if ($updateStockStmt->affected_rows === 0) {
            throw new Exception("Insufficient stock for product ID: $prod_id");
        }

        $insertRecordStmt->bind_param(
            "sissssdiis",
            $transaction_id,
            $prod_id,
            $prod_img,
            $prod_name,
            $prod_type,
            $prod_brand,
            $prod_price,
            $qty,
            $total_price,
            $date_purchased
        );
        $insertRecordStmt->execute();
    }

    $mysqli->commit();

    $insertRecordStmt->close();
    $updateStockStmt->close();

    echo json_encode(["success" => true, "message" => "Checkout complete"]);

} catch (Exception $e) {
    $mysqli->rollback();
    echo json_encode(["success" => false, "message" => "Checkout failed: " . $e->getMessage()]);
}
?>
