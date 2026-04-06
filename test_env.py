from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env")

print("File exists:", os.path.exists(".env"))
print("Your key is:", os.getenv("GROQ_API_KEY"))