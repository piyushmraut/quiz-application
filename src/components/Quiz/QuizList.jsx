// import { useState, useEffect } from 'react';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db, auth } from '../../firebase';
// import { Link } from 'react-router-dom';
// import { ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// const QuizList = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const q = query(collection(db, 'quizzes'));
//         const querySnapshot = await getDocs(q);
//         const quizzesData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
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

//   const filteredQuizzes = quizzes.filter(quiz =>
//     quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return <div className="text-center py-12">Loading quizzes...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Available Quizzes</h1>
//         <div className="w-64">
//           <input
//             type="text"
//             placeholder="Search quizzes..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         </div>
//       </div>

//       {filteredQuizzes.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500">No quizzes found</p>
//         </div>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2">
//           {filteredQuizzes.map((quiz) => (
//             <div key={quiz.id} className="bg-white shadow rounded-lg overflow-hidden">
//               <div className="p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h2>
//                 <p className="text-gray-600 mb-4">{quiz.description}</p>
//                 <div className="flex items-center text-sm text-gray-500 mb-4">
//                   <ClockIcon className="h-4 w-4 mr-1" />
//                   <span>{quiz.timeLimit} minutes</span>
//                   <DocumentTextIcon className="h-4 w-4 ml-3 mr-1" />
//                   <span>{quiz.questions.length} questions</span>
//                 </div>
//                 <Link
//                   to={`/take-quiz/${quiz.id}`}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   Take Quiz
//                 </Link>
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
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Link } from "react-router-dom";
import {
  ClockIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

const QuizList = () => {
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

  if (loading) {
    return <div className="text-center py-12">Loading quizzes...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Quizzes</h1>
        <div className="flex space-x-4">
          <div className="w-64">
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <Link
            to="/create-quiz"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Quiz
          </Link>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No quizzes found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white shadow rounded-lg overflow-hidden"
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
                    <Link
                      to={`/edit-quiz/${quiz.id}`}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Edit quiz"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{quiz.timeLimit} minutes</span>
                  <DocumentTextIcon className="h-4 w-4 ml-3 mr-1" />
                  <span>{quiz.questions.length} questions</span>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to={`/take-quiz/${quiz.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Take Quiz
                  </Link>
                  {quiz.createdBy === auth.currentUser?.uid && (
                    // In your QuizList component, update the View Results button:
                    <Link
                      to={`/quiz-results/${quiz.id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Results
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
