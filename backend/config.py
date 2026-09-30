import os
from dotenv import load_dotenv

# Load local environment variables from .env file
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(env_path)

MAPTILER_API_KEY = os.getenv("MAPTILER_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "coalsentinel.db")
PORT = int(os.getenv("PORT", "8001"))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3001")
