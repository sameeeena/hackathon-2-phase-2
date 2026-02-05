import sqlite3
import os

db_path = 'frontend/auth.db'

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS jwks (
            id TEXT PRIMARY KEY,
            publicKey TEXT NOT NULL,
            privateKey TEXT NOT NULL,
            createdAt INTEGER NOT NULL,
            expiresAt INTEGER
        );
        """)
        print("Created jwks table")
            
    except Exception as e:
        print(f"Error modifying database: {e}")

    conn.commit()
    conn.close()
else:
    print("auth.db not found")
