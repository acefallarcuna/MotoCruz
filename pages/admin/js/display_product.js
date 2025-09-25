document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector("table tbody");
    const searchInput = document.querySelector(".search-input");
    const headers = document.querySelectorAll("thead th");

    let allProducts = [];
    let filteredProducts = [];

    let currentSort = {
        column: null,
        asc: true
    };

    const columnMap = {
        1: 'prod_name',
        2: 'prod_type',
        3: 'prod_brand',
        4: 'prod_stock'
    };

    const sortFunctions = {
        prod_name: (a, b) => a.prod_name.localeCompare(b.prod_name),
        prod_type: (a, b) => a.prod_type.localeCompare(b.prod_type),
        prod_brand: (a, b) => a.prod_brand.localeCompare(b.prod_brand),
        prod_stock: (a, b) => a.prod_stock - b.prod_stock,
    };

    function showLowStockPopup(lowStockItems) {
        if (!lowStockItems.length) return;

        const bg = document.createElement("div");
        bg.className = "ws-bg";

        const box = document.createElement("div");
        box.className = "ws-box";

        const inner = document.createElement("div");
        inner.className = "ws-inner";

        inner.innerHTML = `
            <h2 class="ws-title">⚠️ Low On Stock</h2>
            <p class="ws-sub">The following product(s) are low on stock:</p>
            <ul class="ws-list">
                ${lowStockItems.map(p => `
                    <li><strong>${p.prod_name}</strong> — ${p.prod_stock}</li>
                `).join("")}
            </ul>
            <div class="ws-button-wrap">
                <button class="ws-button">OK</button>
            </div>
        `;

        box.appendChild(inner);
        bg.appendChild(box);
        document.body.appendChild(bg);

        requestAnimationFrame(() => {
            bg.style.opacity = "1";
            bg.style.pointerEvents = "auto";
        });

        inner.querySelector(".ws-button").addEventListener("click", () => {
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
    }

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
                <td class="action">
                    <button>
                        <i class='bx bx-cart-add'></i> Add
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function sortProducts(products) {
        if (!currentSort.column) return products;

        const sortFn = sortFunctions[currentSort.column];
        if (!sortFn) return products;

        return products.slice().sort((a, b) => {
            let result = sortFn(a, b);
            return currentSort.asc ? result : -result;
        });
    }

    function filterProducts(query) {
        if (!query) return allProducts;
        return allProducts.filter(product => {
            return (
                product.prod_name.toLowerCase().includes(query) ||
                product.prod_type.toLowerCase().includes(query) ||
                product.prod_brand.toLowerCase().includes(query)
            );
        });
    }

    function updateDisplay() {
        filteredProducts = filterProducts(searchInput.value.trim().toLowerCase());
        const sortedProducts = sortProducts(filteredProducts);
        renderProducts(sortedProducts);
    }

    headers.forEach((header, index) => {
        if ([1, 2, 3, 4].includes(index)) {
            header.style.cursor = "pointer";
            header.addEventListener("click", () => {
                const column = columnMap[index];
                if (!column) return;

                if (currentSort.column === column) {
                    currentSort.asc = !currentSort.asc;
                } else {
                    currentSort.column = column;
                    currentSort.asc = true;
                }

                headers.forEach(h => h.classList.remove("sort-asc", "sort-desc"));
                header.classList.add(currentSort.asc ? "sort-asc" : "sort-desc");

                updateDisplay();
            });
        }
    });

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            updateDisplay();
        });
    }

    fetch('../admin/get_product.php')
        .then(response => response.json())
        .then(products => {
            allProducts = products;

            const lowStockItems = allProducts.filter(p => parseInt(p.prod_stock, 10) <= 5);
            showLowStockPopup(lowStockItems);

            updateDisplay();
        })
        .catch(err => {
            console.error("Error loading products:", err);
        });
});
