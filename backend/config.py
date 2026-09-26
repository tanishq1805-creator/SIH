import os

MAPTILER_API_KEY = os.getenv("MAPTILER_API_KEY", "hKLFGIcit6tIxzesSNve")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AQ.Ab8RN6Jb1voiylyeAq1KwlchhZ3N6GKMaw2JmdeDBUswBxpZyg")
DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "coalsentinel.db")
PORT = int(os.getenv("PORT", "8001"))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3001")

