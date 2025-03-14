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

@app.route('/perguntas/<categoria>', methods=['GET'])
def perguntas_categoria(categoria):
    perguntas_filtradas = [p for p in questions if p['Categoria'].lower() == categoria.lower()]
    
    if not perguntas_filtradas:
        return jsonify({"erro": "Categoria não encontrada ou sem perguntas."}), 404
    
    return jsonify(perguntas_filtradas)


@app.route("/quiz")
def quiz():
    return render_template('quiz.html')

'''
@app.route("/question", methods= ["GET"])
def get_questions(Categoria):
    for q in questions:
        if q["Geografia"] == Categoria:
            list_question.append(q)

    list_question= random.choice(questions)
    return jsonify(question)
'''
@app.route('/categoria')
def categoria():
    return render_template('categoria.html')

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
