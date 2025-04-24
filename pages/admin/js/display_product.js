document.addEventListener("DOMContentLoaded", function () {
    console.log("JS loaded!");

    fetch('../admin/get_product.php')
        .then(response => response.json())
        .then(products => {
            console.log("Fetched products:", products);

            const tbody = document.querySelector("table tbody");
            console.log("Tbody found:", tbody);
            if (!tbody) return;

            tbody.innerHTML = "";

            products.forEach(product => {
                console.log("Adding row for:", product.prod_name);
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><img src="${product.prod_img}" style="width: 60px;" onerror="this.src='fallback.png';"></td>
                    <td>${product.prod_name}</td>
                    <td>${product.prod_type}</td>
                    <td>${product.prod_brand}</td>
                    <td>${product.prod_stock}</td>
                    <td>${parseFloat(product.prod_price).toFixed(2)}</td>
                    <td class="action">
                        <button>
                            <i class='bx bx-cart-add' ></i> Add
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error("Error loading products:", err);
        });
});
