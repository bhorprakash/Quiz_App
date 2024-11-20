import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ViewQuiz.css';

const ViewQuiz = () => {
    const { id } = useParams(); 
    const [quiz, setQuiz] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(''); 
    const [revealedAnswers, setRevealedAnswers] = useState({}); 

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/quizzes/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz data');
                }
                const data = await response.json();
                setQuiz(data); 
            } catch (error) {
                console.error('Error fetching quiz:', error);
                setErrorMessage('There was a problem loading the quiz. Please try again later.');
            } finally {
                setLoading(false); 
            }
        };

        fetchQuiz();
    }, [id]);

    const handleRevealAnswer = (questionIndex) => {
        setRevealedAnswers((prev) => ({
            ...prev,
            [questionIndex]: !prev[questionIndex],
        }));
    };

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    if (!quiz) {
        return <div>Quiz not found!</div>;
    }

    return (
        <div className="view-quiz-container">
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>

            <h3>Questions:</h3>
            <ul>
                {quiz.questions && quiz.questions.length > 0 ? (
                    quiz.questions.map((question, index) => (
                        <li key={index} className="question-item">
                            <strong>{question.question_text}</strong>
                            <ul className="options-list">
                                {question.options.map((option, idx) => (
                                    <li key={idx} className="option-item">
                                        <button 
                                            onClick={() => handleRevealAnswer(index)} 
                                            style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                color: 'blue', 
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            {option}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {revealedAnswers[index] && (
                                <p>
                                    <strong>Correct Option:</strong> 
                                    {question.options[question.correct_option] || 'Not Available'}
                                </p>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No questions available for this quiz.</p>
                )}
            </ul>
        </div>
    );
};

export default ViewQuiz;
