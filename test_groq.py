from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

key = os.getenv("GROQ_API_KEY")
print("Loaded key:", key)

try:
    client = Groq(api_key=key)

    print("Sending request to Groq...")

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": "Say hello in one stylish sentence."}
        ],
        temperature=0.7,
        max_tokens=50
    )

    print("✅ Groq Connected Successfully!")
    print("AI Response:")
    print(completion.choices[0].message.content)

except Exception as e:
    print("❌ Error occurred:")
    print(type(e))
    print(e)