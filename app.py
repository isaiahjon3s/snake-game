from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///snakegame.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# HighScore model
class HighScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<HighScore {self.player_name}: {self.score}>'

# Create database tables
with app.app_context():
    db.create_all()

# Root route - Always returns a response
@app.route('/')
def index():
    return render_template('index.html')

# Save score route
@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.get_json()
    if not data or 'name' not in data or 'score' not in data:
        return jsonify({'error': 'Invalid data'}), 400
    name = data['name']
    score = data['score']
    new_score = HighScore(player_name=name, score=score)
    db.session.add(new_score)
    db.session.commit()
    return jsonify({'message': 'Score saved successfully'}), 200

# High scores route
@app.route('/high_scores')
def high_scores():
    scores = HighScore.query.order_by(HighScore.score.desc()).limit(10).all()
    scores_list = [{'name': score.player_name, 'score': score.score} for score in scores]
    return jsonify(scores_list)

if __name__ == '__main__':
    app.run(debug=True)