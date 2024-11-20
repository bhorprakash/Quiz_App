import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import QuizList from './Components/QuizList';
import CreateQuiz from './Components/CreateQuiz';
import EditQuiz from './Components/EditQuiz';
import ViewQuiz from './Components/ViewQuiz';
import DeleteQuiz from './Components/DeleteQuiz';
import './App.css';
function App() {
    return (
        <Router>
            <nav>
                <a href="/">Home</a>
                <a href="/quizzes">Quiz List</a>
                <a href="/create">Create Quiz</a>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quizzes" element={<QuizList />} />
                <Route path="/create" element={<CreateQuiz />} />
                <Route path="/edit/:id" element={<EditQuiz />} />
                <Route path="/view/:id" element={<ViewQuiz />} />
                <Route path="/delete/:id" element={<DeleteQuiz />}/>
            </Routes>
        </Router>
    );
}

export default App;
