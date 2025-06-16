# StudyBot

StudyBot is an AI-powered educational assistant that provides personalized learning support for students in years 7-12. It features a modern, user-friendly interface and customizable explanation styles to suit different learning preferences.

## Features

-   **Personalized Learning**: Adapts explanations based on student's year level (7-12)
-   **Multiple Explanation Styles**:
    -   Step-by-Step: Detailed, sequential explanations
    -   Visual: Descriptions optimized for visual learning
    -   Simple Summary: Concise, easy-to-understand explanations
    -   Real-World Examples: Practical applications and relatable contexts
-   **Low Data Mode**: Option to receive concise responses for slower connections
-   **Chat Session Management**: Save and switch between different learning conversations
-   **Markdown Support**: Rich text formatting for clear, structured explanations
-   **Dark Theme UI**: Easy on the eyes for extended study sessions

## Prerequisites

-   Python 3.8+
-   Node.js (for development)
-   Groq API key

## Installation

1. Clone the repository:

```powershell
git clone <repository-url>
cd studybot
```

2. Install Python dependencies:

```powershell
pip install -r requirements.txt
```

3. Set up your Groq API key:

```powershell
$env:GROQ_API_KEY = "your-api-key-here"
```

## Running the Application

1. Start the Flask server:

```powershell
python app.py
```

2. Open your web browser and navigate to:

```
http://localhost:5000
```

## Usage

1. Select your year level (7-12) from the dropdown menu
2. Choose your preferred explanation style:
    - Step-by-Step
    - Visual
    - Simple Summary
    - Real-World Example
3. Toggle Low Data Mode if needed
4. Type your question in the chat input
5. Press Enter or click Send to get your response
6. Create new chat sessions or switch between existing ones using the sidebar

## Project Structure

```
studybot/
├── app.py              # Flask backend server
├── requirements.txt    # Python dependencies
└── static/
    ├── index.html     # Frontend HTML
    ├── styles.css     # CSS styling
    └── script.js      # Frontend JavaScript
```

## API Endpoints

-   `POST /api/chat`: Send messages to StudyBot
    -   Request body:
        ```json
        {
            "message": "string",
            "yearLevel": "string",
            "explanationType": "string",
            "lowDataMode": "boolean",
            "conversationHistory": "array"
        }
        ```

## Technologies Used

-   **Backend**:

    -   Flask (Python web framework)
    -   Groq (LLM API)
    -   Flask-CORS (Cross-Origin Resource Sharing)

-   **Frontend**:
    -   HTML5
    -   CSS3
    -   JavaScript
    -   Marked.js (Markdown rendering)

## License

[MIT License](LICENSE)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
