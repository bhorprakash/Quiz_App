const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bunty',
    database: 'quizdb',
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

// --- QUIZZES ENDPOINTS ---

// Fetch all quizzes
app.get('/api/quizzes', (req, res) => {
    const sql = 'SELECT * FROM quizzes';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Fetch a single quiz by id (including questions)
app.get('/api/quizzes/:id', (req, res) => {
    const sql = 'SELECT * FROM quizzes WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        const quiz = result[0];
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const questionSql = 'SELECT * FROM questions WHERE quiz_id = ?';
        db.query(questionSql, [quiz.id], (err, questions) => {
            if (err) throw err;
            quiz.questions = questions.map(q => ({
                id: q.id,
                question_text: q.question_text,
                options: JSON.parse(q.options),
                correct_option: q.correct_option
            }));
            res.json(quiz);
        });
    });
});

// Create a new quiz (with questions)
app.post('/api/quizzes', (req, res) => {
    const { title, description, questions } = req.body;

    if (!title || !description || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Title, description, and questions are required' });
    }

    const quizSql = 'INSERT INTO quizzes (title, description) VALUES (?, ?)';
    db.query(quizSql, [title, description], (err, result) => {
        if (err) throw err;
        const quizId = result.insertId;

        const questionValues = questions.map(q => [
            quizId, 
            q.question_text, 
            JSON.stringify(q.options), 
            q.correct_option
        ]);

        if (questionValues.length > 0) {
            const questionSql = 'INSERT INTO questions (quiz_id, question_text, options, correct_option) VALUES ?';
            db.query(questionSql, [questionValues], (err) => {
                if (err) throw err;
                res.json({ message: 'Quiz and questions created successfully' });
            });
        } else {
            res.status(400).json({ message: 'No questions provided' });
        }
    });
});


// Update an existing quiz
app.put('/api/questions/:id', (req, res) => {
    const { question_text, options, correct_option } = req.body;

    
    if (!question_text || !Array.isArray(options) || !correct_option) {
        return res.status(400).json({ message: 'Question text, options, and correct option are required' });
    }

    const updateQuestionSql = `
        UPDATE questions 
        SET question_text = ?, options = ?, correct_option = ? 
        WHERE id = ?`;

    db.query(
        updateQuestionSql,
        [
            question_text, 
            JSON.stringify(options), 
            correct_option.toString(),
            req.params.id
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error updating the question' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Question not found' });
            }

            res.json({ message: 'Question updated successfully' });
        }
    );
});


app.delete('/api/quizzes/:id', (req, res) => {
    const sql = 'DELETE FROM quizzes WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: 'Quiz deleted successfully' });
    });
});

// --- QUESTIONS ENDPOINTS ---

app.get('/api/questions', (req, res) => {
    const sql = 'SELECT * FROM questions';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/api/quizzes/:id/questions', (req, res) => {
    const sql = 'SELECT * FROM questions WHERE quiz_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result.map(q => ({
            id: q.id,
            question_text: q.question_text,
            options: JSON.parse(q.options), 
            correct_option: q.correct_option
        })));
    });
});

app.post('/api/quizzes/:id/questions', (req, res) => {
    const { question_text, options, correct_option } = req.body;

    if (!question_text || !Array.isArray(options) || typeof correct_option !== 'string') {
        return res.status(400).json({ message: 'Invalid question data' });
    }

    const sql = 'INSERT INTO questions (quiz_id, question_text, options, correct_option) VALUES (?, ?, ?, ?)';
    db.query(sql, [req.params.id, question_text, JSON.stringify(options), correct_option], (err) => {
        if (err) throw err;
        res.json({ message: 'Question added successfully' });
    });
});

app.delete('/api/questions/:id', (req, res) => {
    const sql = 'DELETE FROM questions WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: 'Question deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
