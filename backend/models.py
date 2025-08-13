"""
Database models and table creation for the chat application
"""
import psycopg2
from config import Config

def drop_and_create_tables():
    """Drop and recreate tables with new schema"""
    
    # Connect to database
    conn = psycopg2.connect(Config.DATABASE_URL)
    cur = conn.cursor()
    
    try:
        # Drop existing tables
        cur.execute("DROP TABLE IF EXISTS messages CASCADE")
        cur.execute("DROP TABLE IF EXISTS sessions CASCADE")
        
        # Create sessions table
        cur.execute("""
            CREATE TABLE sessions (
                id SERIAL PRIMARY KEY,
                session_id TEXT UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create messages table
        cur.execute("""
            CREATE TABLE messages (
                id SERIAL PRIMARY KEY,
                session_id TEXT REFERENCES sessions(session_id),
                content TEXT NOT NULL,
                role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'ai')),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create indexes for performance
        cur.execute("""
            CREATE INDEX idx_messages_session_id 
            ON messages(session_id)
        """)
        
        cur.execute("""
            CREATE INDEX idx_messages_timestamp 
            ON messages(timestamp)
        """)
        
        conn.commit()
        print("✅ Database tables recreated successfully with TEXT session_id!")
        
    except Exception as e:
        print(f"❌ Error recreating tables: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def create_tables():
    """Create the database tables if they don't exist"""
    
    # Connect to database
    conn = psycopg2.connect(Config.DATABASE_URL)
    cur = conn.cursor()
    
    try:
        # Create sessions table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                session_id TEXT UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create messages table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                session_id TEXT REFERENCES sessions(session_id),
                content TEXT NOT NULL,
                role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'ai')),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create indexes for performance
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_messages_session_id 
            ON messages(session_id)
        """)
        
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_messages_timestamp 
            ON messages(timestamp)
        """)
        
        conn.commit()
        print(" Database tables created successfully!")
        
    except Exception as e:
        print(f"L Error creating tables: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def test_connection():
    """Test database connection"""
    try:
        conn = psycopg2.connect(Config.DATABASE_URL)
        cur = conn.cursor()
        cur.execute("SELECT 1")
        result = cur.fetchone()
        cur.close()
        conn.close()
        print(" Database connection successful!")
        return True
    except Exception as e:
        print(f"L Database connection failed: {e}")
        return False

if __name__ == "__main__":
    # Run this file directly to recreate tables
    print("🔧 Setting up database...")
    if test_connection():
        drop_and_create_tables()
    else:
        print("❌ Cannot create tables - database connection failed")