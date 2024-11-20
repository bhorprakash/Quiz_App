import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './DeleteQuiz.css'; 

function DeleteQuiz() {
    const { id } = useParams();  
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/api/quizzes/${id}`)
            .then((response) => {
                setQuiz(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching quiz:', error);
                setError('Failed to load quiz data.');
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        axios.delete(`http://localhost:3001/api/quizzes/${id}`)
            .then(() => {
                alert('Quiz deleted successfully!');
                navigate('/quizzes');
            })
            .catch((error) => {
                console.error('Error deleting quiz:', error);
                setError('Failed to delete quiz.');
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="delete-quiz-container">
            <h1>Delete Quiz</h1>
            {quiz ? (
                <div>
                    <p>Are you sure you want to delete the quiz titled "<strong>{quiz.title}</strong>"?</p>
                    <p>This action will delete all the associated questions.</p>
                    <button className="delete-button" onClick={handleDelete}>Delete Quiz</button>
                    <button className="cancel-button" onClick={() => navigate('/quizzes')}>Cancel</button>
                </div>
            ) : (
                <p>Quiz not found.</p>
            )}
        </div>
    );
}

export default DeleteQuiz;
