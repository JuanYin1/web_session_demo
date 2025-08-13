"""
Database connection for Supabase Transaction Pooler
(Supabase handles connection pooling automatically)
"""
import psycopg2
from contextlib import contextmanager
from config import Config

def get_db_connection():
    """Get a new connection - Supabase Transaction Pooler handles pooling"""
    try:
        print(f"🔧 Attempting to connect with: {Config.DATABASE_URL[:50]}...")
        conn = psycopg2.connect(Config.DATABASE_URL)
        print("✅ Database connection successful!")
        return conn
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        print(f"❌ DATABASE_URL: {Config.DATABASE_URL}")
        return None

def close_db_connection(conn):
    """Close the database connection"""
    if conn:
        conn.close()

@contextmanager
def get_db():
    """Context manager for database connections"""
    conn = get_db_connection()
    try:
        yield conn
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        close_db_connection(conn)