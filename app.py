from pyexpat import model
import cohere
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from flask import Flask, request, render_template
from model import *

co = cohere.Client('gqVPQNIEYu4Dei3YOaopVg9xwUyWU1VDD7tMBEyq')
app = Flask(__name__)

@app.route('/', methods =["GET", "POST"])
def gfg():
    if request.method == "POST":
       input = request.form.get("fname")
       
       
       inputs=[input, "disgusting", "excited"]
       print(type(inputs))
       embeddings_train = co.embed(texts=inputs,
                             model="large",
                             truncate="LEFT").embeddings
       score = svm_classifier.predict(embeddings_train)
       final = str(score)


    #    response = co.classify(model='medium',inputs=inputs,examples=examples)
    #    g=str(response)
       print(score)
    #    result = response.classifications
       return final
    return render_template("index.html")