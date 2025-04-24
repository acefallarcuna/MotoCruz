<?php
    require '_config/_auth.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!----======== CSS ======== -->
    <link rel="stylesheet" href="css/inventory.css">
    <link rel="stylesheet" href="css/_sidenav.css">
    <!----===== Boxicons CSS ===== -->
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    <title>Inventory</title>
</head>
<body>
    <?php require_once 'partials/_sidenav.php'; ?>

    <section class="home">
        <div class="cont-prod">
            <div class="cont-table">
                <table>
                    <thead>
                        <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Brand</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- JS will fill this -->
                    </tbody>
                </table>
            </div>

            <div class="cont-btn">
                <button class="add-product-button">
                    <i class='bx bx-layer-plus' ></i> Add Product
                </button>
            </div>

        </div>
    </section>

    <script src="js/_sidenav.js"></script>
    <script src="js/add_product.js"></script>
    <script src="js/get_product.js"></script>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
</body>
</html>