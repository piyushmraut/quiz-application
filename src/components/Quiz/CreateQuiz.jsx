import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  ]);
  const [timeLimit, setTimeLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'quizzes'), {
        title,
        description,
        questions,
        timeLimit,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Quiz</h1>
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              id="timeLimit"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Question {qIndex + 1}</h2>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor={`question-${qIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <input
                type="text"
                id={`question-${qIndex}`}
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name={`correct-answer-${qIndex}`}
                    checked={question.correctAnswer === oIndex}
                    onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Question
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {loading ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;