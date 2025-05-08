// // src/components/Quiz/QuizList.jsx

// import { useState, useEffect } from "react";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db, auth } from "../../firebase";
// import { Link } from "react-router-dom";
// import {
//   ClockIcon,
//   DocumentTextIcon,
//   PencilIcon,
// } from "@heroicons/react/24/outline";
// import { useAuth } from "../../context/AuthContext";

// const QuizList = () => {
//   const { isAdmin } = useAuth();
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const q = query(collection(db, "quizzes"));
//         const querySnapshot = await getDocs(q);
//         const quizzesData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setQuizzes(quizzesData);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuizzes();
//   }, []);

//   const filteredQuizzes = quizzes.filter(
//     (quiz) =>
//       quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return <div className="text-center py-12">Loading quizzes...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Available Quizzes</h1>
//         <div className="flex space-x-4">
//           <div className="w-64">
//             <input
//               type="text"
//               placeholder="Search quizzes..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           {isAdmin && (
//             <Link
//               to="/create-quiz"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Create Quiz
//             </Link>
//           )}
//         </div>
//       </div>

//       {filteredQuizzes.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500">No quizzes found</p>
//         </div>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2">
//           {filteredQuizzes.map((quiz) => (
//             <div
//               key={quiz.id}
//               className="bg-white shadow rounded-lg overflow-hidden"
//             >
//               <div className="p-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                       {quiz.title}
//                     </h2>
//                     <p className="text-gray-600 mb-4">{quiz.description}</p>
//                   </div>
//                   {quiz.createdBy === auth.currentUser?.uid && (
//                     <Link
//                       to={`/edit-quiz/${quiz.id}`}
//                       className="text-indigo-600 hover:text-indigo-800"
//                       title="Edit quiz"
//                     >
//                       <PencilIcon className="h-5 w-5" />
//                     </Link>
//                   )}
//                 </div>
//                 <div className="flex items-center text-sm text-gray-500 mb-4">
//                   <ClockIcon className="h-4 w-4 mr-1" />
//                   <span>{quiz.timeLimit} minutes</span>
//                   <DocumentTextIcon className="h-4 w-4 ml-3 mr-1" />
//                   <span>{quiz.questions.length} questions</span>
//                 </div>
//                 <div className="flex space-x-3">
//                   <Link
//                     to={`/take-quiz/${quiz.id}`}
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Take Quiz
//                   </Link>
//                   {quiz.createdBy === auth.currentUser?.uid && (
//                     // In your QuizList component, update the View Results button:
//                     <Link
//                       to={`/quiz-results/${quiz.id}`}
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     >
//                       View Results
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizList;

// src/components/Quiz/QuizList.jsx

import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import clockAnimation from "../../animations/clock.json";
import documentAnimation from "../../animations/document.json";
import searchAnimation from "../../animations/search.json";
import emptyAnimation from "../../animations/empty-state.json";
import loadingAnimation from "../../animations/loading.json";

const QuizList = () => {
  const { isAdmin } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const q = query(collection(db, "quizzes"));
        const querySnapshot = await getDocs(q);
        const quizzesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizzes(quizzesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  // Lottie animation options
  const defaultOptions = (animationData) => {
    return {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-32 h-32">
          <Lottie options={defaultOptions(loadingAnimation)} />
        </div>
        <p className="text-lg font-medium text-indigo-700 mt-4">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Available Quizzes
        </h1>
        <div className="flex space-x-4">
          <div className="w-64 relative">
            <div className="absolute left-3 top-2.5 w-5 h-5">
              <Lottie options={defaultOptions(searchAnimation)} />
            </div>
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-indigo-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-300"
            />
          </div>
          {isAdmin && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/create-quiz"
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                Create Quiz
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-48 h-48">
            <Lottie options={defaultOptions(emptyAnimation)} />
          </div>
          <p className="text-xl font-medium text-indigo-700 mt-4">No quizzes found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or create a new quiz</p>
        </div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredQuizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              className="bg-white rounded-xl overflow-hidden border border-indigo-100"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {quiz.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{quiz.description}</p>
                  </div>
                  {quiz.createdBy === auth.currentUser?.uid && (
                    <motion.div whileHover={{ scale: 1.2, rotate: 15 }} whileTap={{ scale: 0.9 }}>
                      <Link
                        to={`/edit-quiz/${quiz.id}`}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                        title="Edit quiz"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="w-5 h-5 mr-1">
                    <Lottie options={defaultOptions(clockAnimation)} />
                  </div>
                  <span>{quiz.timeLimit} minutes</span>
                  <div className="w-5 h-5 ml-3 mr-1">
                    <Lottie options={defaultOptions(documentAnimation)} />
                  </div>
                  <span>{quiz.questions.length} questions</span>
                </div>
                <div className="flex space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Link
                      to={`/take-quiz/${quiz.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                    >
                      Take Quiz
                    </Link>
                  </motion.div>
                  {quiz.createdBy === auth.currentUser?.uid && (
                    <motion.div
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="flex-1"
                    >
                      <Link
                        to={`/quiz-results/${quiz.id}`}
                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-indigo-300 text-sm font-medium rounded-full shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                      >
                        View Results
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default QuizList;