from flask import Flask,request, jsonify, render_template
import pandas as pd 
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

CSV_FILE_GAME = os.path.join(os.path.dirname(__file__), "instances","Log-Jogo.csv")

def initialize_csvjogo():
    if not os.path.exists(CSV_FILE_GAME):
        df = pd.DataFrame(columns=[
            "id_pessoa", "horario_inicio_jogo", "horario_fim_jogo", "horario_total", 
            "respostas_acertadas", "respostas_skip", "respostas_erradas"
        ])
        df.to_csv(CSV_FILE_GAME, index=False)

CSV_FILE = os.path.join(os.path.dirname(__file__), "instances","Log-Foto.csv")

def initialize_csvfoto():
    if not os.path.exists(CSV_FILE):
        df = pd.DataFrame(columns=["id_pessoa", "horario_da_foto"])
        df.to_csv(CSV_FILE, index=False)

csv_path = os.path.join(os.path.dirname(__file__), "instances", "Quiz-Chico.csv")

def load_question():
    df = pd.read_csv(csv_path)
    return df.to_dict(orient="records")

questions_global = load_question()

csv_path_parametros = os.path.join(os.path.dirname(__file__), "instances", "Parametros.csv")

def initializa_csvparametros():
    if not os.path.exists(csv_path_parametros):
        df = pd.DataFrame(columns=["tempo_de_resposta", "quantidade_de_perguntas"])
        df.to_csv(csv_path_parametros, index=False)

def load_parametros():
    df = pd.read_csv(csv_path_parametros)
    return df.to_dict(orient="records")

parametros_global = load_parametros()
parametros_global = parametros_global[0]

@app.route('/parametros', methods=['GET'])
def get_parametros():
    return jsonify(parametros_global)

'''
    list_question= random.choice(questions)
    return jsonify(question)
'''
@app.route('/log_jogo', methods=['POST'])
def log_jogo():
    data = request.json
    required_fields = [
        "id_pessoa", "horario_inicio_jogo", "horario_fim_jogo", "horario_total", 
        "respostas_acertadas", "respostas_skip", "respostas_erradas", "pontuacao_final"
    ]
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Campos obrigatórios ausentes"}), 400
    
    df = pd.DataFrame([data], columns=required_fields)
    df.to_csv(CSV_FILE_GAME, mode='a', header=not os.path.exists(CSV_FILE), index=False)
    
    return jsonify({"message": "Registro salvo com sucesso"}), 201

@app.route('/log_foto', methods=['POST'])
def log_foto():
    data = request.json
    id_pessoa = data.get("id_pessoa")
    horario_da_foto = data.get("horario_da_foto")
    
    if not id_pessoa or not horario_da_foto:
        return jsonify({"error": "Campos obrigatórios ausentes"}), 400
    
    df = pd.DataFrame([[id_pessoa, horario_da_foto]], columns=["id_pessoa", "horario_da_foto"])
    df.to_csv(CSV_FILE, mode='a', header=not os.path.exists(CSV_FILE), index=False)
    
    return jsonify({"message": "Registro salvo com sucesso"}), 201

@app.route('/selfie')
def foto():
    return render_template('fotos.html')

@app.route('/categoria')
def categoria():
    return render_template('categoria.html')

@app.route("/quiz")
def quiz():
    return render_template('quiz.html')


@app.route('/perguntas/<categoria>', methods=['GET'])
def perguntas_categoria(categoria):
    questions = load_question()
    perguntas_filtradas = [p for p in questions if p['Categoria'].lower() == categoria.lower()]
    
    if not perguntas_filtradas:
        return jsonify({"erro": "Categoria não encontrada ou sem perguntas."}), 404
    
    return jsonify(perguntas_filtradas)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/standby')
def standby():
    return render_template('standby.html')

if __name__ == '__main__':
    app.run(debug=True)
