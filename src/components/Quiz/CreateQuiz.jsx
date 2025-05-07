import { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon, TrashIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { generateQuizWithAI } from '../../services/gemini';

const CreateQuiz = () => {
  const { quizId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
  ]);
  const [timeLimit, setTimeLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const navigate = useNavigate();

  // ... (keep existing useEffect and other functions)
useEffect(() => {
    if (quizId) {
      const fetchQuiz = async () => {
        setLoading(true);
        try {
          const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
          if (quizDoc.exists()) {
            const quizData = quizDoc.data();
            setTitle(quizData.title);
            setDescription(quizData.description);
            setQuestions(quizData.questions);
            setTimeLimit(quizData.timeLimit);
            setIsEditing(true);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    }
  }, [quizId]);

  // ... rest of your component code remains the same ...

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: null,
      },
    ]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // Handle question text change
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Handle option change
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  // Set correct answer
  const setCorrectAnswer = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  // Add option to a question
  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  // Remove option from a question
  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    
    // Adjust correct answer if needed
    if (newQuestions[qIndex].correctAnswer === oIndex) {
      newQuestions[qIndex].correctAnswer = null;
    } else if (newQuestions[qIndex].correctAnswer > oIndex) {
      newQuestions[qIndex].correctAnswer -= 1;
    }
    
    setQuestions(newQuestions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all questions have correct answers
    const hasInvalidQuestions = questions.some(q => q.correctAnswer === null || q.correctAnswer === undefined);
    if (hasInvalidQuestions) {
      alert('Please select correct answers for all questions');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await updateDoc(doc(db, 'quizzes', quizId), {
          title,
          description,
          questions,
          timeLimit,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'quizzes'), {
          title,
          description,
          questions,
          timeLimit,
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser.uid,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async () => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteDoc(doc(db, 'quizzes', quizId));
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
      }
    }
  };


  // Add new function for AI generation
  const generateWithAI = async () => {
    if (!title.trim()) {
      setAiError('Please enter a quiz title first');
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      const generatedQuiz = await generateQuizWithAI({
        title,
        description,
        timeLimit,
        numQuestions
      });

      setQuestions(generatedQuiz.questions);
      setDescription(generatedQuiz.description);
      setTimeLimit(generatedQuiz.timeLimit);
    } catch (error) {
      setAiError('Failed to generate quiz with AI. Please try again.');
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  // Update the return statement to include AI generation UI
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
      </h1>
      
      {/* Add AI Generation Section */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <SparklesIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">AI Quiz Generator</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Let AI generate questions for your quiz based on your title and description.</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <div>
                  <label htmlFor="numQuestions" className="block text-sm font-medium text-blue-800">
                    Number of Questions
                  </label>
                  <select
                    id="numQuestions"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {[3, 5, 10, 15].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={generateWithAI}
                    disabled={aiLoading || loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? 'Generating...' : 'Generate with AI'}
                    <SparklesIcon className="ml-2 -mr-1 h-5 w-5" />
                  </button>
                </div>
              </div>
              {aiError && (
                <div className="mt-2 text-sm text-red-600">{aiError}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the form remains the same */}
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
                  title="Remove question"
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
              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setCorrectAnswer(qIndex, oIndex)}
                      className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
                        question.correctAnswer === oIndex
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={question.correctAnswer === oIndex ? 'Correct answer' : 'Mark as correct'}
                    >
                      {question.correctAnswer === oIndex ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <span className="text-xs">✓</span>
                      )}
                    </button>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Remove option"
                      >
                        {/* <XIcon className="h-5 w-5" /> */}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {question.options.length < 6 && (
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="-ml-0.5 mr-1 h-3 w-3" />
                  Add Option
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center">
          <div>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Question
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleDeleteQuiz}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                Delete Quiz
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Quiz' : 'Save Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;