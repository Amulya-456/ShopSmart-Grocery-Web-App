document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const product = {
        product_name: document.getElementById("productname").value.trim(),
        rating: parseFloat(document.getElementById("rating").value),
        price: parseFloat(document.getElementById("price").value),
        image: document.getElementById("image").value.trim(),
        category: document.getElementById("category").value,
        quantity: parseInt(document.getElementById("countInStock").value),
        description: document.getElementById("description").value.trim()
    };

    try {

        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });

        const data = await response.json();

        if (response.ok) {

            alert("✅ Product Added Successfully!");

            document.getElementById("productForm").reset();

            // Optional redirect
            // window.location.href = "/products";

        } else {

            alert(data.message || "❌ Failed to add product");
        }

    } catch (error) {

        console.error("Error:", error);

        alert("❌ Server Error");
    }
});