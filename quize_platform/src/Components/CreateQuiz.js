import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateQuiz.css';

function CreateQuiz() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { question_text: '', options: ['', '', '', ''], correct_option: 0 }
    ]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!title || !description || questions.some(q => !q.question_text || q.options.some(o => !o))) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        const newQuiz = {
            title,
            description,
            questions: questions.map(q => ({
                question_text: q.question_text,
                options: q.options,
                correct_option: q.correct_option
            }))
        };

        try {
            await axios.post('http://localhost:3001/api/quizzes', newQuiz);
            navigate('/quizzes'); 
        } catch (error) {
            console.error('Error creating quiz:', error);
            setErrorMessage('There was an error creating the quiz.');
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_option: 0 }]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question_text = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleCorrectOptionChange = (questionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].correct_option = parseInt(value, 10); 
        setQuestions(updatedQuestions);
    };

    return (
        <div className="create-quiz-container">
            <h1>Create Quiz</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label style={{color:'black'}}>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label style={{color:'black'}}>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <h2 style={{color:'black'}}>Questions</h2>
                {questions.map((question, index) => (
                    <div key={index} className="question-group">
                        <label style={{color:'black'}}>Question {index + 1}:</label>
                        <input
                            type="text"
                            value={question.question_text}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            required
                        />

                        <h4 style={{color:'black'}}>Options</h4>
                        {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="option-group">
                                <label style={{marginLeft:'30px',color:'black'}}>{optionIndex + 1}:</label>
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                    required
                                />
                            </div>
                        ))}

                        <label style={{color:'black'}}>Correct Option:</label>
                        <input
                            type="number"
                            value={question.correct_option}
                            onChange={(e) => handleCorrectOptionChange(index, e.target.value)}
                            min="1"
                            max="4"
                            required
                        />

                        <button
                            type="button"
                            className="remove-question-btn"
                            onClick={() => removeQuestion(index)}
                        >
                            Remove Question
                        </button>
                    </div>
                ))}

                <button type="button" className="add-question-btn" onClick={addQuestion}>
                    Add Question
                </button>

                <button type="submit" className="submit-btn">
                    Create Quiz
                </button>
            </form>
        </div>
    );
}

export default CreateQuiz;
