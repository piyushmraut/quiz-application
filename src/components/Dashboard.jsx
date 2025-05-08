// import { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
// import { db, auth } from '../firebase';
// import { Link } from 'react-router-dom';
// import { 
//   ChartBarIcon, 
//   DocumentTextIcon, 
//   ClockIcon,
//   TrophyIcon,
//   UserIcon,
// } from '@heroicons/react/24/outline';
// import { useAuth } from '../context/AuthContext';

// const Dashboard = () => {
//   const { isAdmin } = useAuth();
//   const [userQuizzes, setUserQuizzes] = useState([]);
//   const [userResults, setUserResults] = useState([]);
//   const [recentQuizzes, setRecentQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userStats, setUserStats] = useState({
//     totalCreated: 0,
//     totalTaken: 0,
//     averageScore: 0,
//     bestScore: 0
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch quizzes created by the user
//         const quizzesQuery = query(
//           collection(db, 'quizzes'),
//           where('createdBy', '==', auth.currentUser.uid)
//         );
//         const quizzesSnapshot = await getDocs(quizzesQuery);
//         const quizzesData = quizzesSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setUserQuizzes(quizzesData);

//         // Fetch quiz results for the user - ordered by completedAt
//         // Note: This requires a Firestore index
//         const resultsQuery = query(
//           collection(db, 'results'),
//           where('userId', '==', auth.currentUser.uid),
//           orderBy('completedAt', 'desc')
//         );
//         const resultsSnapshot = await getDocs(resultsQuery);
//         const resultsData = resultsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//           completedAt: doc.data().completedAt?.toDate()
//         }));
//         setUserResults(resultsData);

//         // Calculate user stats
//         const totalCreated = quizzesData.length;
//         const totalTaken = resultsData.length;
        
//         let totalScore = 0;
//         let bestScore = 0;
        
//         resultsData.forEach(result => {
//           const percentage = Math.round((result.score / result.totalQuestions) * 100);
//           totalScore += percentage;
//           if (percentage > bestScore) {
//             bestScore = percentage;
//           }
//         });
        
//         const averageScore = totalTaken > 0 ? Math.round(totalScore / totalTaken) : 0;

//         setUserStats({
//           totalCreated,
//           totalTaken,
//           averageScore,
//           bestScore
//         });

//         // Fetch recent quizzes (limit to 5) - ordered by createdAt
//         const recentQuizzesQuery = query(
//           collection(db, 'quizzes'),
//           orderBy('createdAt', 'desc'),
//           limit(5)
//         );
//         const recentQuizzesSnapshot = await getDocs(recentQuizzesQuery);
//         const recentQuizzesData = recentQuizzesSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setRecentQuizzes(recentQuizzesData);

//       } catch (err) {
//         console.error('Error fetching data:', err);
//         // Handle the error gracefully
//         if (err.code === 'failed-precondition') {
//           console.log('Please create the required Firestore index for the results query');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         {isAdmin && <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
//               <DocumentTextIcon className="h-6 w-6" />
//             </div>
            
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Quizzes Created</h3>
//               <p className="text-2xl font-semibold text-gray-900">{userStats.totalCreated}</p>
//             </div>
//           </div>
//         </div>}
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-green-100 text-green-600">
//               <ChartBarIcon className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Quizzes Taken</h3>
//               <p className="text-2xl font-semibold text-gray-900">{userStats.totalTaken}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//               <ClockIcon className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
//               <p className="text-2xl font-semibold text-gray-900">{userStats.averageScore}%</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-purple-100 text-purple-600">
//               <TrophyIcon className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Best Score</h3>
//               <p className="text-2xl font-semibold text-gray-900">{userStats.bestScore}%</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {isAdmin && <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">Your Quizzes</h2>
//           </div>
//           {userQuizzes.length === 0 ? (
//             <div className="p-6 text-center text-gray-500">
//               You haven't created any quizzes yet
//               <div className="mt-4">
//                 <Link
//                   to="/create-quiz"
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   Create Your First Quiz
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {userQuizzes.slice(0, 5).map((quiz) => (
//                 <li key={quiz.id} className="p-4 hover:bg-gray-50">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <Link to={`/take-quiz/${quiz.id}`} className="block">
//                         <h3 className="text-md font-medium text-indigo-600">{quiz.title}</h3>
//                         <p className="text-sm text-gray-500 mt-1">{quiz.questions.length} questions</p>
//                       </Link>
//                     </div>
//                     <div className="flex space-x-2">
//                       <Link
//                         to={`/edit-quiz/${quiz.id}`}
//                         className="text-indigo-600 hover:text-indigo-800"
//                         title="Edit quiz"
//                       >
//                         {/* <PencilIcon className="h-5 w-5" /> */}
//                       </Link>
//                       <Link
//                         to={`/quiz-results/${quiz.id}`}
//                         className="text-purple-600 hover:text-purple-800"
//                         title="View results"
//                       >
//                         <ChartBarIcon className="h-5 w-5" />
//                       </Link>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
          
//           <div className="p-4 border-t border-gray-200 flex justify-between">
//         {isAdmin && (
//           <Link
//             to="/create-quiz"
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Create New Quiz
//           </Link>
//         )}
//         {userQuizzes.length > 0 && (
//           <Link
//             to="/quizzes"
//             className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             View All
//           </Link>
//         )}
//       </div>
//         </div>}

//         <div className="space-y-6">
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-lg font-medium text-gray-900">Recent Results</h2>
//             </div>
//             {userResults.length === 0 ? (
//               <div className="p-6 text-center text-gray-500">
//                 You haven't taken any quizzes yet
//                 <div className="mt-4">
//                   <Link
//                     to="/quizzes"
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Take a Quiz
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <ul className="divide-y divide-gray-200">
//                 {userResults.slice(0, 5).map((result) => (
//                   <li key={result.id} className="p-4 hover:bg-gray-50">
//                     <Link to={`/quiz-results/${result.quizId}`} className="block">
//                       <h3 className="text-md font-medium text-gray-900">{result.quizTitle}</h3>
//                       <div className="flex items-center mt-1">
//                         <span className={`text-sm font-medium ${
//                           (result.score / result.totalQuestions) >= 0.7 ? 'text-green-600' :
//                           (result.score / result.totalQuestions) >= 0.5 ? 'text-yellow-600' :
//                           'text-red-600'
//                         }`}>
//                           {result.score}/{result.totalQuestions} (
//                           {Math.round((result.score / result.totalQuestions) * 100)}%)
//                         </span>
//                         <span className="mx-2 text-gray-300">|</span>
//                         <span className="text-xs text-gray-500">
//                           {result.completedAt?.toLocaleDateString()}
//                         </span>
//                       </div>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//             {userResults.length > 0 && (
//               <div className="p-4 border-t border-gray-200">
//                 <Link
//                   to="/quizzes"
//                   className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   Take More Quizzes
//                 </Link>
//               </div>
//             )}
//           </div>

//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-lg font-medium text-gray-900">Recent Community Quizzes</h2>
//             </div>
//             {recentQuizzes.length === 0 ? (
//               <div className="p-6 text-center text-gray-500">
//                 No quizzes available yet
//               </div>
//             ) : (
//               <ul className="divide-y divide-gray-200">
//                 {recentQuizzes.map((quiz) => (
//                   <li key={quiz.id} className="p-4 hover:bg-gray-50">
//                     <Link to={`/take-quiz/${quiz.id}`} className="block">
//                       <h3 className="text-md font-medium text-gray-900">{quiz.title}</h3>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {quiz.questions.length} questions • {quiz.timeLimit} min
//                       </p>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//             <div className="p-4 border-t border-gray-200">
//               <Link
//                 to="/leaderboard"
//                 className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//               >
//                 <TrophyIcon className="-ml-1 mr-2 h-5 w-5" />
//                 View Leaderboard
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  FileText, 
  Clock,
  Trophy,
  User,
  PenTool,
  BarChart2,
  Layout,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalCreated: 0,
    totalTaken: 0,
    averageScore: 0,
    bestScore: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch quizzes created by the user
        const quizzesQuery = query(
          collection(db, 'quizzes'),
          where('createdBy', '==', auth.currentUser.uid)
        );
        const quizzesSnapshot = await getDocs(quizzesQuery);
        const quizzesData = quizzesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserQuizzes(quizzesData);

        // Fetch quiz results for the user - ordered by completedAt
        const resultsQuery = query(
          collection(db, 'results'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('completedAt', 'desc')
        );
        const resultsSnapshot = await getDocs(resultsQuery);
        const resultsData = resultsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          completedAt: doc.data().completedAt?.toDate()
        }));
        setUserResults(resultsData);

        // Calculate user stats
        const totalCreated = quizzesData.length;
        const totalTaken = resultsData.length;
        
        let totalScore = 0;
        let bestScore = 0;
        
        resultsData.forEach(result => {
          const percentage = Math.round((result.score / result.totalQuestions) * 100);
          totalScore += percentage;
          if (percentage > bestScore) {
            bestScore = percentage;
          }
        });
        
        const averageScore = totalTaken > 0 ? Math.round(totalScore / totalTaken) : 0;

        setUserStats({
          totalCreated,
          totalTaken,
          averageScore,
          bestScore
        });

        // Fetch recent quizzes (limit to 5) - ordered by createdAt
        const recentQuizzesQuery = query(
          collection(db, 'quizzes'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentQuizzesSnapshot = await getDocs(recentQuizzesQuery);
        const recentQuizzesData = recentQuizzesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentQuizzes(recentQuizzesData);

      } catch (err) {
        console.error('Error fetching data:', err);
        // Handle the error gracefully
        if (err.code === 'failed-precondition') {
          console.log('Please create the required Firestore index for the results query');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Animation variants for the icon
  const iconVariants = {
    hover: { 
      rotate: [0, 10, -10, 0],
      transition: { 
        duration: 0.5, 
        repeat: Infinity,
        repeatType: "reverse" 
      }
    }
  };

  // Stats cards colors
  const statCards = [
    { 
      title: "Quizzes Created", 
      value: userStats.totalCreated, 
      icon: <FileText />, 
      bgColor: "bg-gradient-to-r from-pink-400 to-pink-600",
      iconBg: "bg-pink-100" 
    },
    { 
      title: "Quizzes Taken", 
      value: userStats.totalTaken, 
      icon: <Layout />, 
      bgColor: "bg-gradient-to-r from-cyan-400 to-cyan-600",
      iconBg: "bg-cyan-100" 
    },
    { 
      title: "Average Score", 
      value: `${userStats.averageScore}%`, 
      icon: <BarChart2 />, 
      bgColor: "bg-gradient-to-r from-violet-400 to-violet-600",
      iconBg: "bg-violet-100" 
    },
    { 
      title: "Best Score", 
      value: `${userStats.bestScore}%`, 
      icon: <Trophy />, 
      bgColor: "bg-gradient-to-r from-amber-400 to-amber-600",
      iconBg: "bg-amber-100" 
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <motion.div 
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-8 pb-4 border-b border-gray-200"
      >
        <div className="bg-blue-600 text-white p-3 rounded-lg shadow-lg mr-3">
          <User className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          ((card.title !== "Quizzes Created" || isAdmin) && (
            <motion.div
              key={card.title}
              className={`rounded-xl shadow-lg overflow-hidden ${card.bgColor} text-white`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <motion.div 
                    className={`p-3 rounded-full ${card.iconBg} text-gray-800`}
                    whileHover="hover"
                    variants={iconVariants}
                  >
                    {card.icon}
                  </motion.div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-white opacity-80">{card.title}</h3>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isAdmin && (
          <motion.div 
            className="bg-white shadow-lg rounded-xl overflow-hidden lg:col-span-2 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
              <h2 className="text-lg font-bold text-white flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Your Quizzes
              </h2>
            </div>
            {userQuizzes.length === 0 ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="bg-blue-50 text-blue-600 p-4 rounded-full inline-flex mx-auto mb-4"
                >
                  <FileText className="h-8 w-8" />
                </motion.div>
                <p className="text-gray-500 mb-4">You haven't created any quizzes yet</p>
                <Link
                  to="/create-quiz"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700"
                >
                  Create Your First Quiz
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {userQuizzes.slice(0, 5).map((quiz, index) => (
                  <motion.li 
                    key={quiz.id} 
                    className="p-4 hover:bg-blue-50 transition-colors duration-150"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <Link to={`/take-quiz/${quiz.id}`} className="block group">
                          <h3 className="text-lg font-medium text-blue-600 group-hover:text-blue-800 transition-colors duration-150">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <Layout className="h-4 w-4 mr-1 text-blue-400" />
                            {quiz.questions.length} questions
                          </p>
                        </Link>
                      </div>
                      <div className="flex space-x-3">
                        <Link
                          to={`/edit-quiz/${quiz.id}`}
                          className="p-2 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors duration-150"
                          title="Edit quiz"
                        >
                          <PenTool className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/quiz-results/${quiz.id}`}
                          className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-150"
                          title="View results"
                        >
                          <BarChart2 className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
              {isAdmin && (
                <Link
                  to="/create-quiz"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700"
                >
                  Create New Quiz
                </Link>
              )}
              {userQuizzes.length > 0 && (
                <Link
                  to="/quizzes"
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150 shadow-sm"
                >
                  View All
                </Link>
              )}
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          <motion.div 
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Recent Results
              </h2>
            </div>
            {userResults.length === 0 ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="bg-purple-50 text-purple-600 p-4 rounded-full inline-flex mx-auto mb-4"
                >
                  <Award className="h-8 w-8" />
                </motion.div>
                <p className="text-gray-500 mb-4">You haven't taken any quizzes yet</p>
                <Link
                  to="/quizzes"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium shadow hover:shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-purple-700"
                >
                  Take a Quiz
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {userResults.slice(0, 5).map((result, index) => (
                  <motion.li 
                    key={result.id} 
                    className="p-4 hover:bg-purple-50 transition-colors duration-150"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link to={`/quiz-results/${result.quizId}`} className="block group">
                      <h3 className="text-lg font-medium text-purple-600 group-hover:text-purple-800 transition-colors duration-150">
                        {result.quizTitle}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm font-medium rounded-full px-2 py-1 ${
                          (result.score / result.totalQuestions) >= 0.7 ? 'bg-green-100 text-green-700' :
                          (result.score / result.totalQuestions) >= 0.5 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {result.score}/{result.totalQuestions} (
                          {Math.round((result.score / result.totalQuestions) * 100)}%)
                        </span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {result.completedAt?.toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}
            {userResults.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Link
                  to="/quizzes"
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium shadow hover:shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-purple-700"
                >
                  Take More Quizzes
                </Link>
              </div>
            )}
          </motion.div>

          <motion.div 
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-amber-600">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Layout className="mr-2 h-5 w-5" />
                Recent Community Quizzes
              </h2>
            </div>
            {recentQuizzes.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No quizzes available yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentQuizzes.map((quiz, index) => (
                  <motion.li 
                    key={quiz.id} 
                    className="p-4 hover:bg-amber-50 transition-colors duration-150"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link to={`/take-quiz/${quiz.id}`} className="block group">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-amber-600 group-hover:text-amber-800 transition-colors duration-150">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <Layout className="h-4 w-4 mr-1 text-amber-400" />
                            {quiz.questions.length} questions 
                            <span className="mx-1">•</span> 
                            <Clock className="h-4 w-4 mx-1 text-amber-400" />
                            {quiz.timeLimit} min
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-amber-400 group-hover:text-amber-600 transition-colors duration-150" />
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <Link
                to="/leaderboard"
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium shadow hover:shadow-lg transition-all duration-200 hover:from-amber-600 hover:to-amber-700"
              >
                <Trophy className="mr-2 h-5 w-5" />
                View Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

