from flask import Flask, request, jsonify
from flask_cors import CORS
import groq
import os
import logging
from httpx import HTTPStatusError

# Add logging configuration
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")

client = groq.Groq(api_key=api_key)

logging.debug(f"API Key present: {bool(api_key)}")
logging.debug(f"API Key length: {len(api_key) if api_key else 0}")


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data received", "success": False}), 400

        message = data.get("message")
        if not message:
            return (
                jsonify({"error": "No message provided", "success": False}),
                400,
            )
        year_level = data.get("yearLevel", "7")
        explanation_type = data.get("explanationType", "Step-by-Step")
        low_data_mode = data.get("lowDataMode", False)

        logging.debug(
            f"Received request - Message: {message}, Year: {year_level}, Type: {explanation_type}"
        )

        system_prompt = f"""You are StudyBot, an educational AI assistant for Year {year_level} students.
        Provide explanations in {explanation_type} format.
        {'Keep responses concise and minimal.' if low_data_mode else 'Provide detailed explanations.'}\n"""

        try:
            conversation_history = data.get("conversationHistory", [])

            messages = [{"role": "system", "content": system_prompt}]

            for msg in conversation_history[-5:]:
                role = "user" if msg["isUser"] else "assistant"
                messages.append({"role": role, "content": msg["content"]})

            messages.append({"role": "user", "content": message})

            chat_completion = client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0.7,
            )

            response = chat_completion.choices[0].message.content
            logging.debug(f"Successfully got response from Groq API")
            return jsonify({"response": response, "success": True})

        except HTTPStatusError as he:
            logging.error(f"HTTP Status Error: {str(he)}")
            return (
                jsonify({"error": f"API Error: {str(he)}", "success": False}),
                he.response.status_code,
            )

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Server Error: {str(e)}", "success": False}), 500


@app.route("/")
def serve():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run(debug=True)
