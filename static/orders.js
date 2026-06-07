document.addEventListener("DOMContentLoaded", loadOrders);

async function loadOrders() {
    try {

        const response = await fetch("/api/orders");

        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }

        const orders = await response.json();

        renderOrders(orders);

    } catch (error) {

        console.error("Error:", error);

        document.getElementById("ordersContainer").innerHTML = `
            <div class="error">
                ⚠️ Error loading orders.
            </div>
        `;
    }
}

function renderOrders(orders) {

    const container =
        document.getElementById("ordersContainer");

    if (!orders || orders.length === 0) {

        container.innerHTML =
            "<p>No orders found.</p>";

        return;
    }

    container.innerHTML = "";

    orders.forEach(order => {

        const card =
            document.createElement("div");

        card.className = "order-card";

        card.innerHTML = `
            <h3>${order.firstName || ""} ${order.lastName || ""}</h3>

            <p>
                <strong>Phone:</strong>
                ${order.phone || "N/A"}
            </p>

            <p>
                <strong>Address:</strong>
                ${order.address || "N/A"}
            </p>

            <p>
                <div><strong>Payment:</strong>
                ${order.payment_method}
</div>
            </p>

            <p>
                <strong>Total:</strong>
                ₹${order.total || 0}
            </p>

            <p>
                <strong>Status:</strong>
                ${order.status || "Pending"}
            </p>
        `;

        if (order.items && order.items.length > 0) {

            const itemList =
                document.createElement("ul");

            order.items.forEach(item => {

                const li =
                    document.createElement("li");

                li.textContent =
                    `${item.name} - ₹${item.price} × ${item.quantity}`;

                itemList.appendChild(li);
            });

            card.appendChild(itemList);
        }

        container.appendChild(card);
    });
}