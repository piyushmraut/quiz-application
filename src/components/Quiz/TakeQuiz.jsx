// import { useState, useEffect } from 'react';
// import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
// import { db, auth } from '../../firebase';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

// const TakeQuiz = () => {
//   const { quizId } = useParams();
//   const [quiz, setQuiz] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [quizFinished, setQuizFinished] = useState(false);
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
//         if (quizDoc.exists()) {
//           setQuiz(quizDoc.data());
//           setTimeLeft(quizDoc.data().timeLimit * 60);
//         } else {
//           setError('Quiz not found');
//         }
//       } catch (err) {
//         setError('Failed to load quiz');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuiz();
//   }, [quizId]);

//   useEffect(() => {
//     if (timeLeft <= 0) return;
    
//     const timer = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   useEffect(() => {
//     if (timeLeft === 0 && !quizFinished && quiz) { // Added quiz check
//       handleFinishQuiz();
//     }
//   }, [timeLeft, quizFinished, quiz]); // Added quiz to dependencies

//   const handleOptionSelect = (optionIndex) => {
//     if (showFeedback || !quiz) return; // Added quiz check
//     setSelectedOption(optionIndex);
//   };

//   const handleNextQuestion = () => {
//     if (selectedOption === null || !quiz) return; // Added quiz check

//     const currentQuestion = quiz.questions[currentQuestionIndex];
//     setIsCorrect(selectedOption === currentQuestion.correctAnswer);
//     setShowFeedback(true);

//     setTimeout(() => {
//       const newAnswers = [...answers];
//       newAnswers[currentQuestionIndex] = selectedOption;
//       setAnswers(newAnswers);
//       setShowFeedback(false);

//       if (currentQuestionIndex < quiz.questions.length - 1) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//         setSelectedOption(answers[currentQuestionIndex + 1] ?? null);
//       } else {
//         handleFinishQuiz();
//       }
//     }, 1500);
//   };

//   const handleFinishQuiz = async () => {
//     if (!quiz) return;
    
//     setQuizFinished(true);
    
//     const finalAnswers = [...answers];
//     if (selectedOption !== null && currentQuestionIndex < quiz.questions.length) {
//       finalAnswers[currentQuestionIndex] = selectedOption;
//     }

//     const score = quiz.questions.reduce((acc, question, index) => {
//       return acc + (finalAnswers[index] === question.correctAnswer ? 1 : 0);
//     }, 0);

//     try {
//       // First get the user's name from the users collection
//       const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
//       const userName = userDoc.exists() ? userDoc.data().name : auth.currentUser.displayName || 'Anonymous';

//       await addDoc(collection(db, 'results'), {
//         quizId,
//         quizTitle: quiz.title,
//         userId: auth.currentUser.uid,
//         userName, // Use the name from users collection or fallback
//         answers: finalAnswers,
//         score,
//         totalQuestions: quiz.questions.length,
//         completedAt: new Date(),
//       });
//     } catch (err) {
//       console.error('Failed to save results:', err);
//     }

//     navigate(`/quiz-results/${quizId}`, {
//       state: {
//         score,
//         totalQuestions: quiz.questions.length,
//         answers: finalAnswers,
//         questions: quiz.questions,
//       },
//     });
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   if (loading) {
//     return <div className="text-center py-12">Loading quiz...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-12 text-red-600">{error}</div>;
//   }

//   if (!quiz) {
//     return <div className="text-center py-12">Quiz not found</div>;
//   }

//   const currentQuestion = quiz.questions[currentQuestionIndex];

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
//             <div className="flex items-center text-sm font-medium text-gray-700">
//               <ClockIcon className="h-5 w-5 mr-1" />
//               <span>{formatTime(timeLeft)}</span>
//             </div>
//           </div>
//           <p className="text-gray-600 mt-1">{quiz.description}</p>
//           <div className="mt-2 text-sm text-gray-500">
//             Question {currentQuestionIndex + 1} of {quiz.questions.length}
//           </div>
//         </div>

//         <div className="p-6">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.text}</h2>
//           <div className="space-y-3">
//             {currentQuestion.options.map((option, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleOptionSelect(index)}
//                 className={`p-4 border rounded-md cursor-pointer transition-colors ${
//                   selectedOption === index
//                     ? showFeedback
//                       ? isCorrect
//                         ? 'border-green-500 bg-green-50'
//                         : 'border-red-500 bg-red-50'
//                       : 'border-indigo-500 bg-indigo-50'
//                     : 'border-gray-300 hover:border-indigo-300'
//                 }`}
//               >
//                 <div className="flex items-center">
//                   {showFeedback && selectedOption === index && (
//                     <div className="mr-2">
//                       {isCorrect ? (
//                         <CheckCircleIcon className="h-5 w-5 text-green-500" />
//                       ) : (
//                         <XCircleIcon className="h-5 w-5 text-red-500" />
//                       )}
//                     </div>
//                   )}
//                   {option}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="p-6 border-t border-gray-200 flex justify-end">
//           <button
//             onClick={handleNextQuestion}
//             disabled={selectedOption === null || showFeedback}
//             className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TakeQuiz;

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
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
        if (quizDoc.exists()) {
          setQuiz(quizDoc.data());
          setTimeLeft(quizDoc.data().timeLimit * 60);
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
    if (timeLeft === 0 && !quizFinished && quiz) {
      handleFinishQuiz();
    }
  }, [timeLeft, quizFinished, quiz]);

  const handleOptionSelect = (optionIndex) => {
    if (showFeedback || !quiz) return;
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null || !quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    setIsCorrect(selectedOption === currentQuestion.correctAnswer);
    setShowFeedback(true);

    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedOption;
      setAnswers(newAnswers);
      setShowFeedback(false);

      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(answers[currentQuestionIndex + 1] ?? null);
      } else {
        handleFinishQuiz();
      }
    }, 1500);
  };

  const handleFinishQuiz = async () => {
    if (!quiz) return;
    
    setQuizFinished(true);
    
    const finalAnswers = [...answers];
    if (selectedOption !== null && currentQuestionIndex < quiz.questions.length) {
      finalAnswers[currentQuestionIndex] = selectedOption;
    }

    const score = quiz.questions.reduce((acc, question, index) => {
      return acc + (finalAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userName = userDoc.exists() ? userDoc.data().name : auth.currentUser.displayName || 'Anonymous';

      await addDoc(collection(db, 'results'), {
        quizId,
        quizTitle: quiz.title,
        userId: auth.currentUser.uid,
        userName,
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-b-blue-500 border-r-transparent border-l-transparent animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-blue-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-rose-50 to-red-50">
        <div className="p-8 rounded-lg shadow-lg bg-white max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <XCircleIcon className="h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-xl font-bold text-gray-800">Oh no!</h2>
            <p className="mt-2 text-red-600">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="p-8 rounded-lg shadow-lg bg-white max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <XCircleIcon className="h-16 w-16 text-amber-500" />
            <h2 className="mt-4 text-xl font-bold text-gray-800">Quiz Not Found</h2>
            <p className="mt-2 text-gray-600">The quiz you're looking for doesn't exist or may have been removed.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const timeWarning = timeLeft < 60; // Less than 1 minute
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Quiz Header */}
          <div className="bg-gradient-to-r from-violet-500 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <div className={`flex items-center rounded-full px-3 py-1 ${
                timeWarning ? 'bg-red-100 text-red-800' : 'bg-white/20 text-white'
              }`}>
                <ClockIcon className={`h-5 w-5 mr-1 ${timeWarning ? 'text-red-600' : 'text-white'}`} />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <p className="mt-2 text-indigo-100">{quiz.description}</p>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 w-full bg-indigo-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-indigo-100">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span>{Math.round((currentQuestionIndex / quiz.questions.length) * 100)}% Complete</span>
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div className="p-8">
            <h2 className="text-xl font-medium text-gray-800 mb-6">{currentQuestion.text}</h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                let optionClasses = "p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center";
                let iconElement = null;
                
                if (selectedOption === index) {
                  if (showFeedback) {
                    if (isCorrect) {
                      optionClasses += " border-emerald-500 bg-emerald-50 text-emerald-800";
                      iconElement = <CheckCircleIcon className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0" />;
                    } else {
                      optionClasses += " border-rose-500 bg-rose-50 text-rose-800";
                      iconElement = <XCircleIcon className="h-6 w-6 text-rose-500 mr-3 flex-shrink-0" />;
                    }
                  } else {
                    optionClasses += " border-violet-500 bg-violet-50 text-violet-800";
                  }
                } else {
                  optionClasses += " border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-700";
                }
                
                // If this is the correct answer and we're showing feedback, highlight it
                if (showFeedback && index === currentQuestion.correctAnswer && selectedOption !== index) {
                  optionClasses += " border-emerald-300 bg-emerald-50";
                }
                
                return (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={optionClasses}
                  >
                    {iconElement}
                    <span className="text-lg">{option}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {showFeedback && (
                <div className={`font-medium ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isCorrect ? '✓ Correct answer!' : '✗ Incorrect answer'}
                </div>
              )}
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null || showFeedback}
              className="px-6 py-3 rounded-full shadow-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;