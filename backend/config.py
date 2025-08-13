import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    DATABASE_URL = os.getenv('DATABASE_URL', 
        "postgresql://postgres.dldfaffaupbujwxpnvlz:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres")
    
    # Gemini API
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    
    # Pool settings
    DB_POOL_MIN = int(os.getenv('DB_POOL_MIN', 1))
    DB_POOL_MAX = int(os.getenv('DB_POOL_MAX', 10))