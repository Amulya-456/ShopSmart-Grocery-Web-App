from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# =========================
# Database Connection
# =========================

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",
        database="shopsmart"
    )

# =========================
# User Pages
# =========================

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/items")
def items():
    return render_template("item.html")

@app.route("/cart")
def cart():
    return render_template("cart.html")

@app.route("/orders")
def orders():
    return render_template("orders.html")

@app.route("/history")
def history():
    return render_template("history.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/forgot")
def forgot():
    return render_template("forgot.html")

@app.route("/place-order")
def place_order():
    return render_template("placeOrder.html")

# =========================
# Admin Pages
# =========================


@app.route("/users")
def users_page():
    return render_template("user.html")

@app.route("/products")
def products_page():
    return render_template("products.html")

@app.route("/add-product")
def add_product():
    return render_template("addproduct.html")

@app.route("/admin-orders")
def admin_orders():
    return render_template("admin_orders.html")

from flask import redirect

@app.route("/adminlogin", methods=["GET", "POST"])
def admin_login():

    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT * FROM admins
            WHERE username=%s AND password=%s
            """,
            (username, password)
        )

        admin = cursor.fetchone()

        cursor.close()
        conn.close()

        if admin:
            return redirect("/dashboard")

        return render_template(
            "adminlogin.html",
            error="Invalid Username or Password"
        )

    return render_template("adminlogin.html")


@app.route("/adminsignup", methods=["GET", "POST"])
def admin_signup():

    if request.method == "POST":

        name = request.form.get("name")
        username = request.form.get("username")
        password = request.form.get("password")

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM admins WHERE username=%s",
            (username,)
        )

        admin = cursor.fetchone()

        if admin:
            cursor.close()
            conn.close()

            return render_template(
                "adminsignup.html",
                error="Username already exists"
            )

        cursor.execute(
            """
            INSERT INTO admins(name, username, password)
            VALUES(%s, %s, %s)
            """,
            (name, username, password)
        )

        conn.commit()

        cursor.close()
        conn.close()

        return redirect("/adminlogin")

    return render_template("adminsignup.html")

@app.route("/dashboard")
def dashboard():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM products")
    product_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM orders")
    order_count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return render_template(
        "dashboard.html",
        product_count=product_count,
        user_count=user_count,
        order_count=order_count
    )
# =========================
# Signup API
# =========================

@app.route("/api/auth/signup", methods=["POST"])
def signup_api():

    data = request.get_json()
    
    username = data.get("name")
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        conn.close()

        return jsonify({
            "success": False,
            "message": "Email already registered"
        }), 400
    cursor.execute(
        """
        INSERT INTO users(username,email,password)
        VALUES(%s,%s,%s)
        """,
        (username, email, password)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Signup successful"
    })

# =========================
# Login API
# =========================

@app.route("/api/auth/login", methods=["POST"])
def login_api():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email=%s AND password=%s
        """,
        (email, password)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user_id": user["user_id"],
            "username": user["username"]
        })

    return jsonify({
        "success": False,
        "message": "Invalid email or password"
    }), 401

# =========================
# Users API
# =========================

@app.route("/api/users", methods=["GET"])
def get_users():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users")

    users = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(users)

# =========================
# Products API
# =========================

@app.route("/api/products", methods=["GET"])
def get_products():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products")

    products = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(products)

# =========================
# Add Product API
# =========================

@app.route("/api/products", methods=["POST"])
def create_product():

    data = request.get_json()

    product_name = data.get("product_name")
    price = data.get("price")
    quantity = data.get("quantity")
    image = data.get("image")
    category = data.get("category")
    rating = data.get("rating")
    description = data.get("description")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO products
        (
            product_name,
            price,
            quantity,
            image,
            category,
            rating,
            description
        )
        VALUES(%s,%s,%s,%s,%s,%s,%s)
        """,
        (
            product_name,
            price,
            quantity,
            image,
            category,
            rating,
            description
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Product added successfully"
    })

# =========================
# Orders API
# =========================
@app.route("/api/orders", methods=["GET"])
def get_orders():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            o.order_id,
            o.user_id,
            o.order_date,
            o.phone,
            o.address,
            o.payment_method,
            o.total,
            o.status,
            u.username
        FROM orders o
        LEFT JOIN users u
        ON o.user_id = u.user_id
        ORDER BY o.order_id DESC
    """)

    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(orders)

# =========================
# Create Order API
# =========================

@app.route("/api/orders", methods=["POST"])
def create_order():

    data = request.get_json()
    print(data)
    user_id = data.get("user_id", 1)

    phone = data.get("phone")
    address = data.get("address")
    payment_method = data.get("paymentMethod")
    total = data.get("total")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO orders
        (user_id, phone, address, payment_method, total, status)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            user_id,
            phone,
            address,
            payment_method,
            total,
            "Processing"
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Order placed successfully"
    })

# =========================
# Update Product Price
# =========================

@app.route("/api/products/<int:product_id>/update-price", methods=["PUT"])
def update_price(product_id):

    data = request.get_json()
    price = data["price"]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "update products set price=%s where product_id=%s",
        (price, product_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"success": True})

@app.route("/api/products/<int:product_id>/update-stock", methods=["PUT"])
def update_stock(product_id):

    data = request.get_json()
    quantity = data["quantity"]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "update products set quantity=%s where product_id=%s",
        (quantity, product_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"success": True})
# =========================
# Increase Stock
# =========================
@app.route("/api/products/<int:product_id>/increase", methods=["PUT"])
def increase_stock(product_id):

    data = request.get_json()
    quantity = int(data.get("quantity", 1))

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE products
        SET quantity = quantity + %s
        WHERE product_id=%s
        """,
        (quantity, product_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Stock increased"
    })


# =========================
# Decrease Stock
# =========================

@app.route("/api/products/<int:product_id>/decrease", methods=["PUT"])
def decrease_stock(product_id):

    data = request.get_json()
    quantity = int(data.get("quantity", 1))

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE products
        SET quantity =
        CASE
            WHEN quantity > %s THEN quantity - %s
            ELSE 0
        END
        WHERE product_id=%s
        """,
        (quantity, quantity, product_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Stock decreased"
    })
# =========================
# Increase Product Price
# =========================

@app.route("/api/products/<int:product_id>/increase-price", methods=["PUT"])
def increase_price(product_id):

    data = request.get_json()
    amount = float(data.get("amount", 0))

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE products
        SET price = price + %s
        WHERE product_id = %s
        """,
        (amount, product_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"success": True})


# =========================
# Decrease Product Price
# =========================

@app.route("/api/products/<int:product_id>/decrease-price", methods=["PUT"])
def decrease_price(product_id):

    data = request.get_json()
    amount = float(data.get("amount", 0))

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE products
        SET price =
        CASE
            WHEN price > %s THEN price - %s
            ELSE 0
        END
        WHERE product_id = %s
        """,
        (amount, amount, product_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"success": True})

@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM users WHERE user_id=%s",
        (user_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "User deleted successfully"
    })
@app.route("/api/orders/<int:order_id>/status", methods=["PUT"])
def update_order_status(order_id):

    data = request.get_json()
    status = data.get("status")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE orders
        SET status=%s
        WHERE order_id=%s
        """,
        (status, order_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Status updated"
    })
# =========================
# Run App
# =========================

if __name__ == "__main__":
    app.run(debug=True)