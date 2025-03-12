from flask import Flask,request, jsonify, render_template
import pandas as pd 
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

csv_path = os.path.join(os.path.dirname(__file__), "instances", "Quiz-Chico.csv")

def load_question():
    df = pd.read_csv(csv_path)
    return df.to_dict(orient="records")

questions = load_question()

@app.route("/question", methods= ["GET"])
def get_questions():
    question= random.choice(questions)
    return jsonify(question)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
