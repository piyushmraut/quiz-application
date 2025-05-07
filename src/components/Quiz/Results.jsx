import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Results = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [completedAt, setCompletedAt] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Check if we have location state (from TakeQuiz component)
        if (location.state) {
          setScore(location.state.score);
          setTotalQuestions(location.state.totalQuestions);
          setAnswers(location.state.answers);
          setQuestions(location.state.questions);
          setQuizTitle(location.state.quizTitle || '');
          setTimeTaken(location.state.timeTaken || 0);
          setCompletedAt(location.state.completedAt || new Date());
          setLoading(false);
          return;
        }

        // Fetch the quiz first to get questions
        const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          setQuestions(quizData.questions);
          setTotalQuestions(quizData.questions.length);
          setQuizTitle(quizData.title);
          
          // Then fetch the user's result for this quiz
          const resultsQuery = query(
            collection(db, 'results'),
            where('quizId', '==', quizId),
            where('userId', '==', auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(resultsQuery);
          
          if (!querySnapshot.empty) {
            const resultData = querySnapshot.docs[0].data();
            setScore(resultData.score);
            setAnswers(resultData.answers);
            setTimeTaken(resultData.timeTaken || 0);
            setCompletedAt(resultData.completedAt?.toDate() || null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, location.state]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (totalQuestions === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-md mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No results found for this quiz.
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/quizzes"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
          Back to Quizzes
        </Link>
      </div>
    );
  }

  const percentage = Math.round((score / totalQuestions) * 100);
  const performanceMessage =
    percentage >= 80
      ? 'Excellent!'
      : percentage >= 60
      ? 'Good job!'
      : percentage >= 40
      ? 'Not bad!'
      : 'Keep practicing!';

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/quizzes"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeftIcon className="-ml-1 mr-1 h-5 w-5" />
          Back to Quizzes
        </Link>
        <Link
          to="/leaderboard"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View Leaderboard
          <TrophyIcon className="ml-1 h-5 w-5" />
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{quizTitle} - Results</h1>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">Your score:</p>
              <p className="text-3xl font-bold">
                {score} / {totalQuestions}
              </p>
              <p className="text-lg mt-2 text-gray-700">{performanceMessage}</p>
              {timeTaken > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Time taken: {formatTime(timeTaken)}
                </p>
              )}
              {completedAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Completed on: {completedAt.toLocaleDateString()} at {completedAt.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Question Review</h2>
        </div>
        {questions.map((question, index) => (
          <div key={index} className="p-6 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start">
              {answers[index] === question.correctAnswer ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-1" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-1" />
              )}
              <div className="flex-1">
                <h3 className="text-md font-medium text-gray-900">{question.text}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Your answer:</span>{' '}
                    <span
                      className={
                        answers[index] === question.correctAnswer
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {question.options[answers[index]] || 'No answer provided'}
                    </span>
                  </p>
                  {answers[index] !== question.correctAnswer && (
                    <p className="text-sm">
                      <span className="font-medium">Correct answer:</span>{' '}
                      <span className="text-green-600">
                        {question.options[question.correctAnswer]}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="ml-4 text-sm font-medium">
                {answers[index] === question.correctAnswer ? (
                  <span className="text-green-600">+1</span>
                ) : (
                  <span className="text-red-600">0</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <Link
          to={`/take-quiz/${quizId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retake Quiz
        </Link>
        <Link
          to="/leaderboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <TrophyIcon className="-ml-1 mr-2 h-5 w-5" />
          View Leaderboard
        </Link>
      </div>
    </div>
  );
};

export default Results;