<?php
    require '_config/_auth.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!----======== CSS ======== -->
    <link rel="stylesheet" href="css/product.css">
    <link rel="stylesheet" href="css/_navbar.css">
    <link rel="stylesheet" href="css/_sidenav.css">
    <link rel="stylesheet" href="css/_warning.css">
    <!----===== Boxicons CSS ===== -->
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    <title>Products</title>
</head>
<body>
    <?php require_once 'partials/_sidenav.php'; ?>

    <section class="home">
        <!-- Add to Cart Popup -->
        <div id="add-popup" class="add-popup">
            <div class="add-popup-content">
                <span class="close-btn">&times;</span>
                <img id="popup-img" src="" alt="Product image">
                <h3 id="popup-name"></h3>
                <p><strong>Type:</strong> <span id="popup-type"></span></p>
                <p><strong>Brand:</strong> <span id="popup-brand"></span></p>
                <p><strong>Price:</strong> <span id="popup-price"></span></p>

                <label for="popup-qty"></label>
                <input type="number" id="popup-qty" value="1" min="1">

                <button id="popup-add-btn" type="button">Add to Cart</button>
            </div>
        </div>

        <!-- Cart Popup -->
        <div id="cart-popup" class="cart-popup hidden">
            <div class="cart-content">
                <h3>Cart</h3>
                <ul id="cart-items"></ul>
                <button id="checkout-btn">Cashout</button>
            </div>
        </div>

        <nav class="navbar">
            <!-- Search -->
            <div class="navbar-item search-container">
                <input type="text" placeholder="Search products..." class="search-input" />
            </div>
            <!-- Cart -->
            <div class="navbar-item cart-container">
                <a href="#">
                    <i class='bx bx-shopping-bag'></i>
                </a>
            </div>
        </nav>

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
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- JS will fill this -->
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <script src="js/product.js"></script>
    <script src="js/_sidenav.js"></script>
    <script src="js/display_product.js"></script>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
</body>
</html>