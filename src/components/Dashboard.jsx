// import { useState, useEffect } from 'react';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db, auth } from '../firebase';
// import { Link } from 'react-router-dom';
// import { ChartBarIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

// const Dashboard = () => {
//   const [userQuizzes, setUserQuizzes] = useState([]);
//   const [userResults, setUserResults] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
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

//         // Fetch quiz results for the user
//         const resultsQuery = query(
//           collection(db, 'results'),
//           where('userId', '==', auth.currentUser.uid)
//         );
//         const resultsSnapshot = await getDocs(resultsQuery);
//         const resultsData = resultsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setUserResults(resultsData);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const calculateAverageScore = () => {
//     if (userResults.length === 0) return 0;
//     const total = userResults.reduce((sum, result) => sum + (result.score / result.totalQuestions), 0);
//     return Math.round((total / userResults.length) * 100);
//   };

//   if (loading) {
//     return <div className="text-center py-12">Loading dashboard...</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
//               <DocumentTextIcon className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Quizzes Created</h3>
//               <p className="text-2xl font-semibold text-gray-900">{userQuizzes.length}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-green-100 text-green-600">
//               <ChartBarIcon className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Quizzes Taken</h3>
//               <p className="text-2xl font-semibold text-gray-900">{userResults.length}</p>
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
//               <p className="text-2xl font-semibold text-gray-900">{calculateAverageScore()}%</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">Your Quizzes</h2>
//           </div>
//           {userQuizzes.length === 0 ? (
//             <div className="p-6 text-center text-gray-500">
//               You haven't created any quizzes yet
//             </div>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {userQuizzes.map((quiz) => (
//                 <li key={quiz.id} className="p-4 hover:bg-gray-50">
//                   <Link to={`/take-quiz/${quiz.id}`} className="block">
//                     <h3 className="text-md font-medium text-indigo-600">{quiz.title}</h3>
//                     <p className="text-sm text-gray-500 mt-1">{quiz.questions.length} questions</p>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           )}
//           <div className="p-4 border-t border-gray-200">
//             <Link
//               to="/create-quiz"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Create New Quiz
//             </Link>
//           </div>
//         </div>

//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">Recent Results</h2>
//           </div>
//           {userResults.length === 0 ? (
//             <div className="p-6 text-center text-gray-500">
//               You haven't taken any quizzes yet
//             </div>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {userResults.slice(0, 5).map((result) => (
//                 <li key={result.id} className="p-4 hover:bg-gray-50">
//                   <div>
//                     <h3 className="text-md font-medium text-gray-900">{result.quizTitle}</h3>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Score: {result.score}/{result.totalQuestions} (
//                       {Math.round((result.score / result.totalQuestions) * 100)}%)
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       Completed on: {new Date(result.completedAt?.seconds * 1000).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//           <div className="p-4 border-t border-gray-200">
//             <Link
//               to="/quizzes"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Take More Quizzes
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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

// const Dashboard = () => {
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
//         const resultsQuery = query(
//           collection(db, 'results'),
//           where('userId', '==', auth.currentUser.uid),
//           orderBy('completedAt', 'desc')
//         );
//         const resultsSnapshot = await getDocs(resultsQuery);
//         const resultsData = resultsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setUserResults(resultsData);

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

//         // ... (rest of the fetchData function remains the same)
//       } catch (err) {
//         console.error(err);
//         // Handle specific error for missing index
//         if (err.code === 'failed-precondition') {
//           console.log('Please create the required Firestore index:', err.message);
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
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>


//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
//               <DocumentTextIcon className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Quizzes Created</h3>
//               <p className="text-2xl font-semibold text-gray-900">{userStats.totalCreated}</p>
//             </div>
//           </div>
//         </div>
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
//         <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
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
//             <Link
//               to="/create-quiz"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Create New Quiz
//             </Link>
//             {userQuizzes.length > 0 && (
//               <Link
//                 to="/quizzes"
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 View All
//               </Link>
//             )}
//           </div>
//         </div>

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
//                           {result.completedAt?.toDate().toLocaleDateString()}
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

// const Dashboard = () => {
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
//         const resultsQuery = query(
//           collection(db, 'results'),
//           where('userId', '==', auth.currentUser.uid),
//           orderBy('completedAt', 'desc')
//         );
//         const resultsSnapshot = await getDocs(resultsQuery);
//         const resultsData = resultsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
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
//         console.error(err);
//         if (err.code === 'failed-precondition') {
//           console.log('Please create the required Firestore index:', err.message);
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
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
//               <DocumentTextIcon className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Quizzes Created</h3>
//               <p className="text-2xl font-semibold text-gray-900">{userStats.totalCreated}</p>
//             </div>
//           </div>
//         </div>
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
//         <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
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
//             <Link
//               to="/create-quiz"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Create New Quiz
//             </Link>
//             {userQuizzes.length > 0 && (
//               <Link
//                 to="/quizzes"
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 View All
//               </Link>
//             )}
//           </div>
//         </div>

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
//                           {result.completedAt?.toDate().toLocaleDateString()}
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
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClockIcon,
  TrophyIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
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
        // Note: This requires a Firestore index
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Quizzes Created</h3>
              <p className="text-2xl font-semibold text-gray-900">{userStats.totalCreated}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Quizzes Taken</h3>
              <p className="text-2xl font-semibold text-gray-900">{userStats.totalTaken}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
              <p className="text-2xl font-semibold text-gray-900">{userStats.averageScore}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <TrophyIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Best Score</h3>
              <p className="text-2xl font-semibold text-gray-900">{userStats.bestScore}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Quizzes</h2>
          </div>
          {userQuizzes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              You haven't created any quizzes yet
              <div className="mt-4">
                <Link
                  to="/create-quiz"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Your First Quiz
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {userQuizzes.slice(0, 5).map((quiz) => (
                <li key={quiz.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/take-quiz/${quiz.id}`} className="block">
                        <h3 className="text-md font-medium text-indigo-600">{quiz.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{quiz.questions.length} questions</p>
                      </Link>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/edit-quiz/${quiz.id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Edit quiz"
                      >
                        {/* <PencilIcon className="h-5 w-5" /> */}
                      </Link>
                      <Link
                        to={`/quiz-results/${quiz.id}`}
                        className="text-purple-600 hover:text-purple-800"
                        title="View results"
                      >
                        <ChartBarIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="p-4 border-t border-gray-200 flex justify-between">
            <Link
              to="/create-quiz"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Quiz
            </Link>
            {userQuizzes.length > 0 && (
              <Link
                to="/quizzes"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View All
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Results</h2>
            </div>
            {userResults.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                You haven't taken any quizzes yet
                <div className="mt-4">
                  <Link
                    to="/quizzes"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Take a Quiz
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {userResults.slice(0, 5).map((result) => (
                  <li key={result.id} className="p-4 hover:bg-gray-50">
                    <Link to={`/quiz-results/${result.quizId}`} className="block">
                      <h3 className="text-md font-medium text-gray-900">{result.quizTitle}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm font-medium ${
                          (result.score / result.totalQuestions) >= 0.7 ? 'text-green-600' :
                          (result.score / result.totalQuestions) >= 0.5 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {result.score}/{result.totalQuestions} (
                          {Math.round((result.score / result.totalQuestions) * 100)}%)
                        </span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-xs text-gray-500">
                          {result.completedAt?.toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {userResults.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <Link
                  to="/quizzes"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Take More Quizzes
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Community Quizzes</h2>
            </div>
            {recentQuizzes.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No quizzes available yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentQuizzes.map((quiz) => (
                  <li key={quiz.id} className="p-4 hover:bg-gray-50">
                    <Link to={`/take-quiz/${quiz.id}`} className="block">
                      <h3 className="text-md font-medium text-gray-900">{quiz.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {quiz.questions.length} questions • {quiz.timeLimit} min
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="p-4 border-t border-gray-200">
              <Link
                to="/leaderboard"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <TrophyIcon className="-ml-1 mr-2 h-5 w-5" />
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;