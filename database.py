import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",
        database="shopsmart"
    )

    if conn.is_connected():
        print("Connected Successfully")

    conn.close()

except Exception as e:
    print("Error:", e)