
import google.generativeai as genai
from config import Config

# Configure Gemini
genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash-lite')


def llm_chat(input_text: str) -> str:
    try:
        response = model.generate_content(input_text)
        return response.text
    except Exception as e:
        print(f"❌ Error in LLM chat: {e}")
        return "Sorry, I'm having trouble responding right now."

def save_message(cur, session_id, content, role):
    cur.execute(
        "INSERT INTO messages (session_id, content, role) VALUES (%s, %s, %s)",
        (session_id, content, role)
    )
    return True

def get_history(cur, session_id):
    cur.execute(
        "SELECT content, role, timestamp FROM messages WHERE session_id = %s ORDER BY timestamp",
        (session_id,)  # Fixed: added comma for tuple
    )
    return cur.fetchall()

