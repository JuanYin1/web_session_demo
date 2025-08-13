from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from db_pool import get_db_connection, close_db_connection
import uuid
from llm_service import save_message, llm_chat, get_history

app = Flask(__name__)
CORS(app)

@app.route('/api/session', methods=['POST'])
def create_session():
    session_id = str(uuid.uuid4())
    
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO sessions (session_id) VALUES (%s) RETURNING session_id",
            (session_id,)
        )
        result = cur.fetchone()
        conn.commit()
        return jsonify({"session_id": result[0]})
    finally:
        close_db_connection(conn)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    session_id = data['session_id']
    message = data['message']
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        save_message(cur,session_id,message,'user')
        ai_response = llm_chat(message)
        
        # response = openai.chat.completions.create(
        #     model="gpt-3.5-turbo",
        #     messages=[{"role": "user", "content": message}]
        # )
        # response = model.generate_content(message)
        # ai_response = response.text

        save_message(cur, session_id, ai_response, 'assistant')

        conn.commit()
        return jsonify({"response": ai_response})
    finally:
        close_db_connection(conn)

@app.route('/api/history/<session_id>', methods=['GET'])
def get_chat_history(session_id):
    conn=get_db_connection()
    try:
        cur = conn.cursor()
        
        # Save user message
        # cur.execute(
        #     "SELECT content, role, timestamp FROM messages WHERE session_id = %s ORDER BY timestamp",
        #     (session_id,)
        # )

        messages_data = get_history(cur, session_id)
        messages = [{"content": row[0], "role": row[1], "timestamp": row[2]} for row in messages_data]
        return jsonify({"messages": messages})
    finally:
        close_db_connection(conn)
        

if __name__ == '__main__':
    app.run(debug=True, port=5001)