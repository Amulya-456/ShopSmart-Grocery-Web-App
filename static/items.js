const items = [
  { name: "Tomatoes", price: "₹40 / kg", image: "https://buybc.gov.bc.ca/app/uploads/sites/386/2024/03/Tomatoes_190495029.png", category: "Vegetables" },
  { name: "Watermelons", price: "₹30 / kg", image: "https://cdn.mos.cms.futurecdn.net/SxQpyZbdPoWZuXmxKiJ3uF-970-80.jpg.webp", category: "fruits" },
  { name: "Kales", price: "₹35 / kg", image: "https://farmbid.africa/storage/uploads/media/1719487490_Brown%20Collage%20Autumn%20Mood%20Instagram%20Post%20-%202024-06-16T230100.623.png", category: "Vegetables" },
  { name: "Cabbages", price: "₹25 / kg", image: "https://www.garden-products.co.uk/wp-content/uploads/2024/09/Cabbage-new-500x406.jpg", category: "Vegetables" },
  { name: "Milk", price: "₹60 / litre", image: "http://sapinsdairy.com/wp-content/uploads/2021/12/milk-bottle.png", category: "Dairy" },
  { name: "Honey", price: "₹300 / bottle", image: "https://img.etimg.com/thumb/msid-105536179,width-300,height-225,imgsize-76040,resizemode-75/raw-honey.jpg", category: "Dairy" },
  { name: "Cooking oil", price: "₹150 / litre", image: "https://purvina.in/cdn/shop/files/6.jpg?v=1707300406&width=990", category: "Dairy" },
  { name: "Eggs", price: "₹6 / piece", image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ4E9GSMI3y3Qj_y6m7qVbF5PHqiH4TafqyttLcZc2PGug8g4cQ6dgD21jiHK79LGFzF5eVvSD1CsZhYbn9GE8DYLsMbXXx6oy9ehcJFgXqI8hjmjHU43Hj", category: "Dairy" },
  { name: "Garlic", price: "₹82 / kg", image: "https://www.jiomart.com/images/product/original/590000131/garlic-200-g-product-images-o590000131-p590000131-0-202409251737.jpg", category: "Vegetables" },
  { name: "Oranges", price: "₹50 / kg", image: "https://www.allrecipes.com/thmb/LxYI7rgsZihshxReotwCXq0uoqw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-1205638014-2000-d0fbf9170f2d43eeb046f56eec65319c.jpg", category: "fruits" },
  { name: "Pineapples", price: "₹45 / kg", image: "https://www.healthxchange.sg/sites/hexassets/Assets/food-nutrition/pineapple-health-benefits-and-ways-to-enjoy.jpg", category: "fruits" },
  { name: "Chicken", price: "₹250 / kg", image: "https://www.licious.in/blog/wp-content/uploads/2022/03/Chicken-Curry-Cut-min-1.png", category: "Meat" },
  { name: "Mutton", price: "₹1000 / kg", image: "https://img.clevup.in/60613/1695888322778_SKU-1427_0.jpg", category: "Meat" }
];

const container = document.getElementById("items-container");

function loadCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").textContent = cart.length;
    document.getElementById("cart-badge").textContent = cart.length;
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function addToCart(item) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = {
        ...item,
        quantity: 1
    };

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCartCount();
    showToast("✅ Added to Cart");
}

function buyNow(item) {
    const product = {
        ...item,
        quantity: 1
    };

    localStorage.setItem(
        "buyNowItem",
        JSON.stringify(product)
    );

    window.location.href = "/place-order";
}

function displayItems(filteredItems) {
    container.innerHTML = "";

    filteredItems.forEach(item => {

        const card = document.createElement("div");
        card.className = "item-card";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-name">${item.name}</div>
            <div class="item-price">${item.price}</div>

            <div class="button-row">
                <button class="add-to-cart-btn">
                    Add to Cart
                </button>

                <button class="buy-now-btn">
                    Buy Now
                </button>
            </div>
        `;

        card.querySelector(".add-to-cart-btn")
            .addEventListener("click", () => addToCart(item));

        card.querySelector(".buy-now-btn")
            .addEventListener("click", () => buyNow(item));

        container.appendChild(card);
    });
}

function filterItems(category) {
    displayItems(
        items.filter(item => item.category === category)
    );
}

function categoryFilter() {
    const selected =
        document.getElementById("categorySelect").value;

    if (selected === "all") {
        displayItems(items);
    } else {
        filterItems(selected);
    }
}

function searchItems() {
    const query =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered =
        items.filter(item =>
            item.name.toLowerCase().includes(query)
        );

    displayItems(filtered);
}

loadCartCount();
displayItems(items);