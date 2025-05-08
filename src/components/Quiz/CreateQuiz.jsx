// import { useState, useEffect } from 'react';
// import { addDoc, collection, serverTimestamp, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
// import { db, auth } from '../../firebase';
// import { useNavigate, useParams } from 'react-router-dom';
// import { PlusIcon, TrashIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
// import { generateQuizWithAI } from '../../services/gemini';

// const CreateQuiz = () => {
//   const { quizId } = useParams();
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [questions, setQuestions] = useState([
//     {
//       text: '',
//       options: ['', '', '', ''],
//       correctAnswer: null,
//     },
//   ]);
//   const [timeLimit, setTimeLimit] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiError, setAiError] = useState('');
//   const [numQuestions, setNumQuestions] = useState(5);
//   const navigate = useNavigate();

//   // ... (keep existing useEffect and other functions)
// useEffect(() => {
//     if (quizId) {
//       const fetchQuiz = async () => {
//         setLoading(true);
//         try {
//           const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
//           if (quizDoc.exists()) {
//             const quizData = quizDoc.data();
//             setTitle(quizData.title);
//             setDescription(quizData.description);
//             setQuestions(quizData.questions);
//             setTimeLimit(quizData.timeLimit);
//             setIsEditing(true);
//           }
//         } catch (err) {
//           console.error(err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchQuiz();
//     }
//   }, [quizId]);

//   // ... rest of your component code remains the same ...

//   // Add a new question
//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         text: '',
//         options: ['', '', '', ''],
//         correctAnswer: null,
//       },
//     ]);
//   };

//   // Remove a question
//   const removeQuestion = (index) => {
//     const newQuestions = [...questions];
//     newQuestions.splice(index, 1);
//     setQuestions(newQuestions);
//   };

//   // Handle question text change
//   const handleQuestionChange = (index, field, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index][field] = value;
//     setQuestions(newQuestions);
//   };

//   // Handle option change
//   const handleOptionChange = (qIndex, oIndex, value) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].options[oIndex] = value;
//     setQuestions(newQuestions);
//   };

//   // Set correct answer
//   const setCorrectAnswer = (qIndex, oIndex) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].correctAnswer = oIndex;
//     setQuestions(newQuestions);
//   };

//   // Add option to a question
//   const addOption = (qIndex) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].options.push('');
//     setQuestions(newQuestions);
//   };

//   // Remove option from a question
//   const removeOption = (qIndex, oIndex) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].options.splice(oIndex, 1);
    
//     // Adjust correct answer if needed
//     if (newQuestions[qIndex].correctAnswer === oIndex) {
//       newQuestions[qIndex].correctAnswer = null;
//     } else if (newQuestions[qIndex].correctAnswer > oIndex) {
//       newQuestions[qIndex].correctAnswer -= 1;
//     }
    
//     setQuestions(newQuestions);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validate all questions have correct answers
//     const hasInvalidQuestions = questions.some(q => q.correctAnswer === null || q.correctAnswer === undefined);
//     if (hasInvalidQuestions) {
//       alert('Please select correct answers for all questions');
//       setLoading(false);
//       return;
//     }

//     try {
//       if (isEditing) {
//         await updateDoc(doc(db, 'quizzes', quizId), {
//           title,
//           description,
//           questions,
//           timeLimit,
//           updatedAt: serverTimestamp(),
//         });
//       } else {
//         await addDoc(collection(db, 'quizzes'), {
//           title,
//           description,
//           questions,
//           timeLimit,
//           createdAt: serverTimestamp(),
//           createdBy: auth.currentUser.uid,
//         });
//       }
//       navigate('/dashboard');
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete quiz
//   const handleDeleteQuiz = async () => {
//     if (window.confirm('Are you sure you want to delete this quiz?')) {
//       try {
//         await deleteDoc(doc(db, 'quizzes', quizId));
//         navigate('/dashboard');
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };


//   // Add new function for AI generation
//   const generateWithAI = async () => {
//     if (!title.trim()) {
//       setAiError('Please enter a quiz title first');
//       return;
//     }

//     setAiLoading(true);
//     setAiError('');

//     try {
//       const generatedQuiz = await generateQuizWithAI({
//         title,
//         description,
//         timeLimit,
//         numQuestions
//       });

//       setQuestions(generatedQuiz.questions);
//       setDescription(generatedQuiz.description);
//       setTimeLimit(generatedQuiz.timeLimit);
//     } catch (error) {
//       setAiError('Failed to generate quiz with AI. Please try again.');
//       console.error(error);
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   // Update the return statement to include AI generation UI
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">
//         {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
//       </h1>
      
//       {/* Add AI Generation Section */}
//       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
//         <div className="flex items-start">
//           <div className="flex-shrink-0">
//             <SparklesIcon className="h-5 w-5 text-blue-400" />
//           </div>
//           <div className="ml-3 flex-1">
//             <h3 className="text-sm font-medium text-blue-800">AI Quiz Generator</h3>
//             <div className="mt-2 text-sm text-blue-700">
//               <p>Let AI generate questions for your quiz based on your title and description.</p>
//               <div className="mt-4 flex flex-col sm:flex-row gap-4">
//                 <div>
//                   <label htmlFor="numQuestions" className="block text-sm font-medium text-blue-800">
//                     Number of Questions
//                   </label>
//                   <select
//                     id="numQuestions"
//                     value={numQuestions}
//                     onChange={(e) => setNumQuestions(parseInt(e.target.value))}
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                   >
//                     {[3, 5, 10, 15].map(num => (
//                       <option key={num} value={num}>{num}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex items-end">
//                   <button
//                     type="button"
//                     onClick={generateWithAI}
//                     disabled={aiLoading || loading}
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {aiLoading ? 'Generating...' : 'Generate with AI'}
//                     <SparklesIcon className="ml-2 -mr-1 h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//               {aiError && (
//                 <div className="mt-2 text-sm text-red-600">{aiError}</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Rest of the form remains the same */}
//       <form onSubmit={handleSubmit}>
//         <div className="bg-white shadow rounded-lg p-6 mb-6">
//           <div className="mb-4">
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//               Quiz Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
//               Time Limit (minutes)
//             </label>
//             <input
//               type="number"
//               id="timeLimit"
//               min="1"
//               value={timeLimit}
//               onChange={(e) => setTimeLimit(parseInt(e.target.value))}
//               className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               required
//             />
//           </div>
//         </div>

//         {questions.map((question, qIndex) => (
//           <div key={qIndex} className="bg-white shadow rounded-lg p-6 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-medium text-gray-900">Question {qIndex + 1}</h2>
//               {questions.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeQuestion(qIndex)}
//                   className="text-red-600 hover:text-red-800"
//                   title="Remove question"
//                 >
//                   <TrashIcon className="h-5 w-5" />
//                 </button>
//               )}
//             </div>
//             <div className="mb-4">
//               <label htmlFor={`question-${qIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
//                 Question Text
//               </label>
//               <input
//                 type="text"
//                 id={`question-${qIndex}`}
//                 value={question.text}
//                 onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
//               <div className="space-y-2">
//                 {question.options.map((option, oIndex) => (
//                   <div key={oIndex} className="flex items-center">
//                     <button
//                       type="button"
//                       onClick={() => setCorrectAnswer(qIndex, oIndex)}
//                       className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
//                         question.correctAnswer === oIndex
//                           ? 'bg-green-500 text-white'
//                           : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                       }`}
//                       title={question.correctAnswer === oIndex ? 'Correct answer' : 'Mark as correct'}
//                     >
//                       {question.correctAnswer === oIndex ? (
//                         <CheckIcon className="h-4 w-4" />
//                       ) : (
//                         <span className="text-xs">✓</span>
//                       )}
//                     </button>
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                       required
//                     />
//                     {question.options.length > 2 && (
//                       <button
//                         type="button"
//                         onClick={() => removeOption(qIndex, oIndex)}
//                         className="ml-2 text-red-500 hover:text-red-700"
//                         title="Remove option"
//                       >
//                         {/* <XIcon className="h-5 w-5" /> */}
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               {question.options.length < 6 && (
//                 <button
//                   type="button"
//                   onClick={() => addOption(qIndex)}
//                   className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   <PlusIcon className="-ml-0.5 mr-1 h-3 w-3" />
//                   Add Option
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}

//         <div className="flex justify-between items-center">
//           <div>
//             <button
//               type="button"
//               onClick={addQuestion}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
//               Add Question
//             </button>
//             {isEditing && (
//               <button
//                 type="button"
//                 onClick={handleDeleteQuiz}
//                 className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//               >
//                 <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
//                 Delete Quiz
//               </button>
//             )}
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//           >
//             {loading ? 'Saving...' : isEditing ? 'Update Quiz' : 'Save Quiz'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateQuiz;

import { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Trash2, CheckCircle, BookOpen, AlarmClock, XCircle, HelpCircle, Award } from 'lucide-react';
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

  // Add function for AI generation
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

  // Colors for question cards
  const cardColors = [
    'bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-purple-400',
    'bg-gradient-to-br from-green-50 to-teal-50 border-l-4 border-teal-400',
    'bg-gradient-to-br from-amber-50 to-yellow-50 border-l-4 border-amber-400',
    'bg-gradient-to-br from-rose-50 to-pink-50 border-l-4 border-pink-400',
    'bg-gradient-to-br from-sky-50 to-cyan-50 border-l-4 border-cyan-400',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
          <BookOpen className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
        </h1>
      </motion.div>
      
      {/* AI Generation Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-400 p-6 mb-8 rounded-lg shadow-sm"
      >
        <div className="flex items-start">
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="flex-shrink-0 mt-1"
          >
            <Sparkles className="h-6 w-6 text-indigo-500" />
          </motion.div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-indigo-800">AI Quiz Generator</h3>
            <div className="mt-2 text-indigo-700">
              <p>Let AI generate questions for your quiz based on your title and description.</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <div>
                  <label htmlFor="numQuestions" className="block text-sm font-medium text-indigo-800">
                    Number of Questions
                  </label>
                  <select
                    id="numQuestions"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-indigo-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white bg-opacity-70"
                  >
                    {[3, 5, 10, 15].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <motion.button
                    type="button"
                    onClick={generateWithAI}
                    disabled={aiLoading || loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? 'Generating...' : 'Generate with AI'}
                    <motion.div
                      animate={{ 
                        rotate: aiLoading ? [0, 180, 360] : 0,
                        scale: aiLoading ? [1, 1.2, 1] : 1
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: aiLoading ? Infinity : 0
                      }}
                      className="ml-2"
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
              {aiError && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded flex items-center">
                  <XCircle className="h-4 w-4 mr-1" /> {aiError}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-100"
        >
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 text-indigo-500 mr-2" />
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Quiz Title
              </label>
            </div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition-all duration-200"
              required
              placeholder="Enter an engaging title for your quiz"
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-indigo-500 mr-2" />
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition-all duration-200"
              placeholder="Describe what this quiz is about"
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <AlarmClock className="h-5 w-5 text-indigo-500 mr-2" />
              <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
                Time Limit (minutes)
              </label>
            </div>
            <input
              type="number"
              id="timeLimit"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              className="w-24 px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition-all duration-200"
              required
            />
          </div>
        </motion.div>

        {/* Questions */}
        {questions.map((question, qIndex) => (
          <motion.div 
            key={qIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (0.1 * qIndex) }}
            className={`${cardColors[qIndex % cardColors.length]} shadow-md rounded-lg p-6 mb-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-white p-1 rounded-full shadow-sm mr-3"
                >
                  <HelpCircle className="h-5 w-5 text-indigo-500" />
                </motion.div>
                <h2 className="text-lg font-medium text-gray-800">Question {qIndex + 1}</h2>
              </div>
              {questions.length > 1 && (
                <motion.button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-red-500 hover:text-red-700 bg-white bg-opacity-60 p-2 rounded-full"
                  title="Remove question"
                >
                  <Trash2 className="h-5 w-5" />
                </motion.button>
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
                className="w-full px-3 py-2 border border-gray-200 bg-white bg-opacity-80 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition-all duration-200"
                required
                placeholder="Enter your question"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="space-y-3">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center">
                    <motion.button
                      type="button"
                      onClick={() => setCorrectAnswer(qIndex, oIndex)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 shadow-sm ${
                        question.correctAnswer === oIndex
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                          : 'bg-white text-gray-400 hover:bg-gray-100'
                      }`}
                      title={question.correctAnswer === oIndex ? 'Correct answer' : 'Mark as correct'}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.button>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 bg-white bg-opacity-80 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition-all duration-200"
                      required
                      placeholder={`Option ${oIndex + 1}`}
                    />
                    {question.options.length > 2 && (
                      <motion.button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="ml-2 text-red-400 hover:text-red-600 bg-white bg-opacity-60 p-1 rounded-full"
                        title="Remove option"
                      >
                        <XCircle className="h-5 w-5" />
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
              {question.options.length < 6 && (
                <motion.button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white bg-opacity-70 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Option
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + (0.1 * questions.length) }}
          className="flex justify-between items-center mt-8"
        >
          <div>
            <motion.button
              type="button"
              onClick={addQuestion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <motion.div
                animate={{ rotate: [0, 0, 180, 180, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
                className="mr-2"
              >
                <Plus className="h-5 w-5" />
              </motion.div>
              Add Question
            </motion.button>
            {isEditing && (
              <motion.button
                type="button"
                onClick={handleDeleteQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: [0, 0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="mr-2"
                >
                  <Trash2 className="h-5 w-5" />
                </motion.div>
                Delete Quiz
              </motion.button>
            )}
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </motion.div>
                Saving...
              </>
            ) : (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-2"
                >
                  <CheckCircle className="h-5 w-5" />
                </motion.div>
                {isEditing ? 'Update Quiz' : 'Save Quiz'}
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default CreateQuiz;