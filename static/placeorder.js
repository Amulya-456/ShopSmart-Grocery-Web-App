
document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;

    const buyNowItem =
        JSON.parse(localStorage.getItem("buyNowItem"));

    const cartItems =
        JSON.parse(localStorage.getItem("cart")) || [];

    let items = [];

    if (buyNowItem) {

        if (!buyNowItem.quantity) {
            buyNowItem.quantity = 1;
        }

        items.push(buyNowItem);

    } else if (cartItems.length > 0) {

        items = cartItems;
    }

    if (
        !firstName ||
        !lastName ||
        !phone ||
        !address ||
        !paymentMethod ||
        items.length === 0
    ) {
        return showMessage(
            "❌ Please fill all fields and select a product."
        );
    }

    const sanitizedItems = items.map(item => ({
        name: item.name,
        price: Number(
            item.price.toString().replace(/[^0-9]/g, "")
        ),
        quantity: item.quantity || 1,
        image: item.image
    }));

    const total = sanitizedItems.reduce(
        (sum, item) =>
            sum + (item.price * item.quantity),
        0
    );

    try {

        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                phone,
                address,
                paymentMethod,
                items: sanitizedItems,
                total
            })
        });

        const data = await response.json();

        if (response.ok) {

            showMessage(
                "✅ Order placed successfully!"
            );

            localStorage.removeItem("cart");
            localStorage.removeItem("buyNowItem");

            setTimeout(() => {
                window.location.href = "/orders";
            }, 2000);

        } else {

            showMessage(
                "❌ Failed to place order: " +
                (data.message || "")
            );
        }

    } catch (error) {

        console.error(error);

        showMessage(
            "❌ Server error. Please try again later."
        );
    }
});

function showMessage(message) {

    const toast =
        document.getElementById("statusMessage");

    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

