async function loadUsers() {
    try {
        const response = await fetch("/api/users");
        const users = await response.json();

        const tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = "";

        users.forEach((user, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.user_id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="deleteUser(${user.user_id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading users:", error);
    }
}

async function deleteUser(userId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `/api/users/${userId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("User deleted successfully");
            loadUsers();
        } else {
            alert(data.message || "Failed to delete user");
        }

    } catch (error) {
        console.error("Delete Error:", error);
        alert("Server Error");
    }
}

window.onload = loadUsers;