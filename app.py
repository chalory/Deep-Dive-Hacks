from pyexpat import model
import cohere
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from flask import Flask, request, render_template
from model import *

co = cohere.Client("gqVPQNIEYu4Dei3YOaopVg9xwUyWU1VDD7tMBEyq")
app = Flask(__name__)

final = ""


@app.route("/", methods=["GET", "POST"])
@app.route("/index", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        jsonData = request.get_json()
        print(jsonData)

        userResponse = jsonData["userResponse"]
        print(userResponse)

        inputs = [userResponse, "disgusting", "excited"]
        print(inputs)

        # test = ["I like turtles", "They are nice", "good"]

        embeddings_train = co.embed(
            texts=inputs, model="large", truncate="LEFT"
        ).embeddings

        score = svm_classifier.predict(embeddings_train)
        final = str(score)

        #    response = co.classify(model='medium',inputs=inputs,examples=examples)
        #    g=str(response)
        #    result = response.classifications
        # return final

        print(score)
        return {"final": final}
    return render_template("index.html")


if __name__ == "__main__":
    app.run()
