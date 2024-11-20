import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditQuiz.css';

function EditQuiz() {
    const { id } = useParams(); 
    const [title, setTitle] = useState(''); 
    const [description, setDescription] = useState(''); 
    const [questions, setQuestions] = useState([]); 
    const navigate = useNavigate(); 

    useEffect(() => {
        axios.get(`http://localhost:3001/api/quizzes/${id}`)
            .then((response) => {
                const quizData = response.data;
                setTitle(quizData.title); 
                setDescription(quizData.description);
                setQuestions(quizData.questions.map(q => ({
                    id: q.id,
                    question_text: q.question_text,
                    options: q.options || ['', '', '', ''],
                    correct_option: q.correct_option !== undefined ? q.correct_option : 0
                })));
            })
            .catch(() => {
                console.error('Error fetching quiz data.');
            });
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedQuiz = {
            title,
            description,
            questions: questions.map(q => ({
                question_text: q.question_text,
                options: q.options,
                correct_option: q.correct_option
            }))
        };

        axios.put(`http://localhost:3001/api/quizzes/${id}`, updatedQuiz)
            .then(() => {
                navigate('/quizzes'); 
            })
            .catch(() => {
                console.error('Error updating quiz.');
            });
    };

    const addQuestion = () => {
        setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_option: null }]);
    };

    const removeQuestion = (index) => {
        const questionToDelete = questions[index];
        if (questionToDelete.id) {
            axios.delete(`http://localhost:3001/api/questions/${questionToDelete.id}`)
                .then(() => {
                    const newQuestions = [...questions];
                    newQuestions.splice(index, 1);
                    setQuestions(newQuestions);
                })
                .catch(() => {
                    console.error('Error deleting question.');
                });
        } else {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
        }
    };

    const updateQuestion = (index) => {
        const questionToUpdate = questions[index];

        if (questionToUpdate.id) {
            axios.put(`http://localhost:3001/api/questions/${questionToUpdate.id}`, questionToUpdate)
                .then(() => {
                    const newQuestions = [...questions];
                    newQuestions[index] = { ...questionToUpdate }; 
                    setQuestions(newQuestions);
                    console.log('Question updated successfully.');
                })
                .catch((error) => {
                    console.error('Error updating question:', error);
                });
        } else {
            axios.post(`http://localhost:3001/api/questions`, questionToUpdate)
                .then((response) => {
                    const newQuestions = [...questions];
                    newQuestions[index] = { ...questionToUpdate, id: response.data.id }; 
                    setQuestions(newQuestions);
                    console.log('New question created successfully.');
                })
                .catch((error) => {
                    console.error('Error creating question:', error);
                });
        }
    };


    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question_text = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (questionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].correct_option = parseInt(value, 10);
        setQuestions(newQuestions);
    };

    return (
        <div className="edit-quiz-container">
            <h1>Edit Quiz</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <h2 style={{ color: 'black' }}>Questions</h2>
                {questions.map((question, index) => (
                    <div key={index} className="question-block">
                        <label>Question {index + 1}:</label>
                        <input
                            type="text"
                            value={question.question_text}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            required
                        />

                        <h4>Options</h4>
                        {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="option-group">
                                <label>Option {optionIndex + 1}:</label>
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                    required
                                />
                            </div>
                        ))}

                        <label>Correct Option (index):</label>
                        <input
                            type="number"
                            value={question.correct_option}
                            onChange={(e) => handleCorrectOptionChange(index, e.target.value)}
                            min="1"
                            max="4" 
                            required
                        />
                        <button type="button" className="remove-question" onClick={() => removeQuestion(index)}>Remove Question</button>
                        <button type="button" className="update-question" onClick={() => updateQuestion(index)}>Update Question</button>
                    </div>
                ))}

                <button type="button" className="add-question" onClick={addQuestion}>Add Question</button>
            </form>
        </div>
    );
}

export default EditQuiz;
