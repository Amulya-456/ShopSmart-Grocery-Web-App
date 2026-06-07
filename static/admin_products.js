function getImage(name) {

    const images = {

        Tomato: "https://buybc.gov.bc.ca/app/uploads/sites/386/2024/03/Tomatoes_190495029.png",
        Potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
        Milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500",
        Apple: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
        Watermelon: "https://cdn.mos.cms.futurecdn.net/SxQpyZbdPoWZuXmxKiJ3uF-970-80.jpg.webp",
        Kale: "https://upload.wikimedia.org/wikipedia/commons/2/24/Kale-Bundle.jpg",
        Cabbage: "https://www.garden-products.co.uk/wp-content/uploads/2024/09/Cabbage-new-500x406.jpg",
        Honey: "https://upload.wikimedia.org/wikipedia/commons/5/59/Honey.jpg",
        CookingOil: "https://upload.wikimedia.org/wikipedia/commons/0/06/Olive_oil.jpg",
        Eggs: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Chicken_eggs.jpg",
        Garlic: "https://www.jiomart.com/images/product/original/590000131/garlic-200-g-product-images-o590000131-p590000131-0-202409251737.jpg",
        Orange: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg",
        Pineapple: "https://www.healthxchange.sg/sites/hexassets/Assets/food-nutrition/pineapple-health-benefits-and-ways-to-enjoy.jpg",
        Chicken: "https://www.licious.in/blog/wp-content/uploads/2022/03/Chicken-Curry-Cut-min-1.png",
        Mutton: "https://img.clevup.in/60613/1695888322778_SKU-1427_0.jpg"
    };

    return images[name] || "https://via.placeholder.com/250";
}

const container = document.getElementById("productGrid");

async function loadProducts() {

    try {

        const response = await fetch("/api/products");
        const products = await response.json();

        container.innerHTML = "";

        products.forEach(product => {

            console.log(product);

            const card = document.createElement("div");
            card.className = "item-card";

            let category = "other";

            if (["Tomato", "Potato", "Kale", "Cabbage", "Garlic", "onion", "onion test"].includes(product.product_name))
                category = "vegetables";

            else if (["Apple", "Orange", "Pineapple", "Watermelon"].includes(product.product_name))
                category = "fruits";

            else if (["Milk", "Eggs", "Honey"].includes(product.product_name))
                category = "dairy";

            else if (["Chicken", "Mutton"].includes(product.product_name))
                category = "meat";

            card.dataset.category = category;

            const imageUrl =
                product.image && product.image.trim() !== ""
                    ? product.image
                    : getImage(product.product_name);

            card.innerHTML = `
                <img
                    src="${imageUrl}"
                    alt="${product.product_name}"
                    class="product-image"
                    onerror="this.src='https://via.placeholder.com/250'">

                <div class="item-name">${product.product_name}</div>

                <div class="item-price">
                    ₹${product.price}
                </div>

                <div class="item-stock">
                    Stock: ${product.quantity}
                </div>

                <button onclick="editPrice(${product.product_id}, ${product.price})">
                    Edit Price
                </button>

                <button onclick="editStock(${product.product_id}, ${product.quantity})">
                    Edit Stock
                </button>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading products:", error);

    }
}
document.getElementById("categoryFilter").addEventListener("change", filterProducts);

function filterProducts() {

    const category = document
        .getElementById("categoryFilter")
        .value
        .toLowerCase();

    const cards = document.querySelectorAll(".item-card");

    cards.forEach(card => {

        const cardCategory = card.dataset.category;

        if (category === "all" || cardCategory === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
}
function searchProducts() {

    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const cards = document.querySelectorAll(".item-card");

    cards.forEach(card => {

        const productName = card
            .querySelector(".item-name")
            .textContent
            .toLowerCase();

        card.style.display = productName.includes(searchValue)
            ? "block"
            : "none";
    });
}
async function editPrice(id, currentPrice) {

    const newPrice = prompt("Enter new price:", currentPrice);

    if (!newPrice) return;

    const response = await fetch(`/api/products/${id}/update-price`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            price: Number(newPrice)
        })
    });

    const data = await response.json();

    console.log(data);

    alert("Price Updated");

    loadProducts();
}
async function editStock(id, currentStock) {

    const newStock = prompt("Enter new stock:", currentStock);

    if (!newStock) return;

    const response = await fetch(`/api/products/${id}/update-stock`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quantity: Number(newStock)
        })
    });

    const data = await response.json();

    console.log(data);

    alert("Stock Updated");

    loadProducts();
}
async function increasePrice(id) {

    const amount = prompt("Enter amount to increase:");

    if (!amount) return;

    await fetch(`/api/products/${id}/increase-price`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: Number(amount)
        })
    });

    loadProducts();
}

async function decreasePrice(id) {

    const amount = prompt("Enter amount to decrease:");

    if (!amount) return;

    await fetch(`/api/products/${id}/decrease-price`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: Number(amount)
        })
    });

    loadProducts();
}

async function increaseStock(id) {

    const quantity = prompt("Enter quantity to add:");

    if (!quantity) return;

    await fetch(`/api/products/${id}/increase`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quantity: Number(quantity)
        })
    });

    loadProducts();
}

async function decreaseStock(id) {

    const quantity = prompt("Enter quantity to remove:");

    if (!quantity) return;

    await fetch(`/api/products/${id}/decrease`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quantity: Number(quantity)
        })
    });

    loadProducts();
}

loadProducts();