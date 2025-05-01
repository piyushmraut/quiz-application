import { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
        if (quizDoc.exists()) {
          setQuiz(quizDoc.data());
          setTimeLeft(quizDoc.data().timeLimit * 60); // Convert minutes to seconds
        } else {
          setError('Quiz not found');
        }
      } catch (err) {
        setError('Failed to load quiz');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !quizFinished) {
      handleFinishQuiz();
    }
  }, [timeLeft, quizFinished]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] ?? null);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = async () => {
    setQuizFinished(true);
    
    // Calculate score
    const finalAnswers = [...answers];
    if (selectedOption !== null && currentQuestionIndex < quiz.questions.length) {
      finalAnswers[currentQuestionIndex] = selectedOption;
    }

    const score = quiz.questions.reduce((acc, question, index) => {
      return acc + (finalAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    // Save results
    try {
      await addDoc(collection(db, 'results'), {
        quizId,
        quizTitle: quiz.title,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        answers: finalAnswers,
        score,
        totalQuestions: quiz.questions.length,
        completedAt: new Date(),
      });
    } catch (err) {
      console.error('Failed to save results:', err);
    }

    navigate(`/quiz-results/${quizId}`, {
      state: {
        score,
        totalQuestions: quiz.questions.length,
        answers: finalAnswers,
        questions: quiz.questions,
      },
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return <div className="text-center py-12">Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (!quiz) {
    return <div className="text-center py-12">Quiz not found</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
            <div className="flex items-center text-sm font-medium text-gray-700">
              <ClockIcon className="h-5 w-5 mr-1" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <p className="text-gray-600 mt-1">{quiz.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.text}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`p-4 border rounded-md cursor-pointer ${
                  selectedOption === index
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;