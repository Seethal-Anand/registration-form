from flask import Flask, request, jsonify
from flask_cors import CORS  # Allows JS to talk to Python
import sqlite3

app = Flask(__name__)
CORS(app) # Enable this so your browser doesn't block the request
DB_NAME = "Users_data.db"

def initialize_database():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, age INTEGER, address TEXT,
            height REAL, weight REAL, mobile TEXT UNIQUE, email TEXT UNIQUE
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/register', methods=['POST'])
def register():
    user_data = request.json

# --- 1. BACKEND DATA CLEANING ---
    # JavaScript sometimes sends numbers as strings. Let's ensure types match DB.
    try:
        name = str(user_data.get('name'))
        age = int(user_data.get('age'))
        address = str(user_data.get('address'))
        height = float(user_data.get('height'))
        weight = float(user_data.get('weight'))
        mobile = str(user_data.get('mobile'))
        email = str(user_data.get('email'))
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid data format (Check numbers/decimals)"}), 400
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # 1. DATABASE VALIDATION (Check if exists)
    check_query = "SELECT * FROM users WHERE mobile = ? OR email = ?"
    cursor.execute(check_query, (user_data['mobile'], user_data['email']))
    if cursor.fetchone():
        conn.close()
        return jsonify({"status": "error", "message": "Mobile or Email already exists!"}), 400

    # 2. STORAGE
    try:
        cursor.execute('''
            INSERT INTO users (name, age, address, height, weight, mobile, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_data['name'], user_data['age'], user_data['address'],
              user_data['height'], user_data['weight'], user_data['mobile'], user_data['email']))
        conn.commit()
        return jsonify({"status": "success", "message": "Saved to Users_data.db"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    initialize_database()
    app.run(debug=True,port=5000)
