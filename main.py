from flask import Flask, jsonify, render_template, url_for, request
from flask_cors import CORS
import openai

openai.api_key_path = './apikey.txt'

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def main_page():
    return render_template('chat.html')

@app.route('/response', methods=['POST'])
def generate_response():
    messages = request.get_json()
    # get the last 5 messages
    last5 = messages['messages'][-5:]

    sys_message = [
        {
            'role': 'system',
            'content': 'You are a helpful and creative assistant. Give all responses as if they are inside a HTML <p> tag.'
        }
    ]

    sys_message.extend(last5)

    try:
        # fire off a request to openai
        chat_response = openai.ChatCompletion.create(
            model = 'gpt-3.5-turbo',
            messages = sys_message
        )
        return jsonify(chat_response), 200

    # error handler    
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'An error occurred'
        }), 500


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000)