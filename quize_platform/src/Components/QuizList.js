import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './QuizList.css';

function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/quizzes')
            .then((response) => {
                setQuizzes(response.data);
            })
            .catch((error) => {
                console.error('Error fetching quizzes:', error);
                setErrorMessage('There was an error fetching quizzes. Please try again later.');
            });
    }, []);

    return (
        <div className="quiz-list-container">
            <h1>Quiz List</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                    <div key={quiz.id} className="quiz-item">
                        <h3 >{quiz.title}</h3>
                        <p style={{color:'black'}}>{quiz.description}</p>
                        <p style={{color:'black'}}><strong>Number of Questions:</strong> {quiz.questions ? quiz.questions.length : 0}</p>

                        <div className="quiz-actions">
                            <Link to={`/view/${quiz.id}`}>View Quiz</Link>
                            <Link to={`/edit/${quiz.id}`}>Edit Quiz</Link>
                            <Link to={`/delete/${quiz.id}`}>Delete Quize</Link>
                        </div>
                    </div>
                ))
            ) : (
                <p>No quizzes available.</p>
            )}

            <div className="create-quiz-link">
                <Link to="/create">Create a New Quiz</Link>
            </div>
        </div>
    );
}

export default QuizList;
