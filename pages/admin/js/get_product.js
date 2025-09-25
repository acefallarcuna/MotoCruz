document.addEventListener("DOMContentLoaded", function () {
    console.log("JS loaded!");

    const tbody = document.querySelector("table tbody");
    const searchInput = document.querySelector(".search-input");
    if (!tbody || !searchInput) return;

    let productsList = [];

    function renderProducts(products) {
        tbody.innerHTML = "";

        products.forEach(product => {
            const stock = Number(product.prod_stock);
            let stockClass = "";

            if (Number.isFinite(stock)) {
                if (stock <= 4) {
                    stockClass = "low-stock";
                } else if (stock <= 9) {
                    stockClass = "mid-stock";
                }
            }

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${product.prod_img}" style="width: 60px;" onerror="this.src='fallback.png';"></td>
                <td>${product.prod_name}</td>
                <td>${product.prod_type}</td>
                <td>${product.prod_brand}</td>
                <td class="${stockClass}">${product.prod_stock}</td>
                <td>₱ ${parseFloat(product.prod_price).toFixed(2)}</td>
                <td class="actions">
                    <button class="edit-product-button"
                        data-id="${product.prod_id}"
                        data-name="${product.prod_name}"
                        data-type="${product.prod_type}"
                        data-brand="${product.prod_brand}"
                        data-stock="${product.prod_stock}"
                        data-price="${product.prod_price}">
                        <i class='bx bx-edit-alt'></i> Edit
                    </button>
                    <button class="delete-product-button" data-id="${product.prod_id}">
                        <i class='bx bx-trash'></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        attachDeleteEvents();
        attachEditEvents();
    }

    function loadProducts() {
        fetch('../admin/get_product.php')
            .then(res => res.json())
            .then(products => {
                console.log("Fetched products:", products);
                productsList = products;
                renderProducts(productsList);

                const lowStock = products.filter(p => {
                    const s = Number(String(p.prod_stock).trim());
                    return Number.isFinite(s) && s <= 5;
                });

                console.log("Low stock items:", lowStock);
                if (lowStock.length > 0) {
                    showWarningOverlay(lowStock);
                }
            })
            .catch(err => console.error("Error loading products:", err));
    }

    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        const filtered = productsList.filter(p =>
            p.prod_name.toLowerCase().includes(query) ||
            p.prod_type.toLowerCase().includes(query) ||
            p.prod_brand.toLowerCase().includes(query)
        );
        renderProducts(filtered);
    });

    function attachDeleteEvents() {
        document.querySelectorAll(".delete-product-button").forEach(button => {
            button.addEventListener("click", function () {
                const prodId = this.dataset.id;
                if (!confirm("Are you sure you want to delete this product?")) return;

                fetch('/motocruz/pages/admin/delete_product.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `prod_id=${encodeURIComponent(prodId)}`
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            alert("Product deleted successfully!");
                            loadProducts(); // refresh table
                        } else {
                            alert("Error: " + data.message);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        alert("Unexpected error occurred.");
                    });
            });
        });
    }

    function attachEditEvents() {
        document.querySelectorAll(".edit-product-button").forEach(button => {
            button.addEventListener("click", function () {
                const prodData = {
                    id: this.dataset.id,
                    name: this.dataset.name,
                    type: this.dataset.type,
                    brand: this.dataset.brand,
                    stock: this.dataset.stock,
                    price: this.dataset.price
                };
                openEditOverlay(prodData);
            });
        });
    }

    function openEditOverlay(product) {
        const overlay = document.createElement("div");
        overlay.className = "overlay-bg";

        const content = document.createElement("div");
        content.className = "overlay-content";

        const inner = document.createElement("div");
        inner.className = "overlay-inner";

        inner.innerHTML = `
            <h2>Edit Product</h2>
            <div class="form-group">
                <label>Upload Image</label>
                <input type="file" accept="image/*">
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" placeholder="Product Name" value="${product.name}">
            </div>
            <div class="form-group">
                <label>Type</label>
                <input type="text" placeholder="Product Type" value="${product.type}">
            </div>
            <div class="form-group">
                <label>Brand</label>
                <input type="text" placeholder="Product Brand" value="${product.brand}">
            </div>
            <div class="form-group">
                <label>Stock</label>
                <input type="number" placeholder="Stock Quantity" value="${product.stock}">
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" step="0.01" placeholder="Product Price" value="${parseFloat(product.price).toFixed(2)}">
            </div>
            <div class="button-container">
                <button class="update-button">Update Product</button>
            </div>
        `;

        content.appendChild(inner);
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = "1";
            overlay.style.pointerEvents = "auto";
        });

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.remove();
        });

        const priceInput = inner.querySelector('input[placeholder="Product Price"]');
        priceInput.addEventListener("blur", () => {
            let val = parseFloat(priceInput.value);
            priceInput.value = isNaN(val) ? "0.00" : val.toFixed(2);
        });
        priceInput.addEventListener("input", () => {
            priceInput.value = priceInput.value.replace(/[^\d.]/g, '');
        });

        inner.querySelector(".update-button").addEventListener("click", function () {
            const updatedData = {
                name: inner.querySelector('input[placeholder="Product Name"]').value,
                type: inner.querySelector('input[placeholder="Product Type"]').value,
                brand: inner.querySelector('input[placeholder="Product Brand"]').value,
                stock: inner.querySelector('input[placeholder="Stock Quantity"]').value,
                price: inner.querySelector('input[placeholder="Product Price"]').value,
                img: inner.querySelector('input[type="file"]').files[0]
            };

            if (!updatedData.name || !updatedData.type || !updatedData.brand || !updatedData.stock || !updatedData.price) {
                alert("Please fill in all fields before updating.");
                return;
            }

            const formData = new FormData();
            formData.append("prod_id", product.id);
            formData.append("prod_name", updatedData.name);
            formData.append("prod_type", updatedData.type);
            formData.append("prod_brand", updatedData.brand);
            formData.append("prod_stock", updatedData.stock);
            formData.append("prod_price", updatedData.price);
            if (updatedData.img) formData.append("prod_img", updatedData.img);

            fetch("/motocruz/pages/admin/edit_product.php", {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert("Product updated successfully!");
                        overlay.remove();
                        loadProducts();
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(err => { 
                    console.error(err);
                    alert("Unexpected error occurred.");
                });
        });
    }

    function showWarningOverlay(lowStockProducts) {
        if (!Array.isArray(lowStockProducts) || lowStockProducts.length === 0) return;

        const bg = document.createElement("div");
        bg.className = "ws-bg";

        const box = document.createElement("div");
        box.className = "ws-box";

        const inner = document.createElement("div");
        inner.className = "ws-inner";

        const itemsHtml = lowStockProducts.map(p => {
            const stock = (p.prod_stock === null || p.prod_stock === undefined) ? "N/A" : String(p.prod_stock).trim();
            const name = p.prod_name || "Unnamed product";
            return `<li><strong>${name}</strong> — <span class="ws-stock">${stock}</span></li>`;
        }).join("");

        inner.innerHTML = `
            <h2 class="ws-title">⚠️ Low On Stock</h2>
            <p class="ws-sub">The following product(s) are running low:</p>
            <ul class="ws-list">${itemsHtml}</ul>
            <div class="ws-button-wrap">
                <button class="ws-button" type="button">OK</button>
            </div>
        `;

        box.appendChild(inner);
        bg.appendChild(box);
        document.body.appendChild(bg);

        requestAnimationFrame(() => {
            bg.style.opacity = "1";
            bg.style.pointerEvents = "auto";
        });

        box.querySelector(".ws-button").addEventListener("click", () => {
            bg.style.opacity = "0";
            bg.style.pointerEvents = "none";
            setTimeout(() => bg.remove(), 300);
        });

        bg.addEventListener("click", (e) => {
            if (e.target === bg) {
                bg.style.opacity = "0";
                bg.style.pointerEvents = "none";
                setTimeout(() => bg.remove(), 300);
            }
        });

        function escHandler(e) {
            if (e.key === "Escape") {
                bg.style.opacity = "0";
                bg.style.pointerEvents = "none";
                setTimeout(() => bg.remove(), 300);
                document.removeEventListener("keydown", escHandler);
            }
        }
        document.addEventListener("keydown", escHandler);
    }

    loadProducts();
});
