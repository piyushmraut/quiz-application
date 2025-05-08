// import { useState, useEffect } from 'react';
// import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
// import { db } from '../../firebase';
// import { TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// const Leaderboard = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//     useEffect(() => {
//       const fetchLeaderboard = async () => {
//         try {
//           // Get all users from the users collection
//           const usersQuery = query(collection(db, 'users'));
//           const usersSnapshot = await getDocs(usersQuery);
//           const usersData = usersSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }));
  
//           // Get results for each user and calculate average score
//           const usersWithScores = await Promise.all(
//             usersData.map(async (user) => {
//               const resultsQuery = query(
//                 collection(db, 'results'),
//                 where('userId', '==', user.id)
//               );
//               const resultsSnapshot = await getDocs(resultsQuery);
//               const results = resultsSnapshot.docs.map(doc => doc.data());
              
//               const totalQuizzes = results.length;
//               const totalScore = results.reduce((sum, result) => sum + result.score, 0);
//               const totalPossible = results.reduce((sum, result) => sum + result.totalQuestions, 0);
//               const averageScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
  
//               return {
//                 ...user,
//                 totalQuizzes,
//                 averageScore
//               };
//             })
//           );
  
//           // Sort by average score (descending)
//           const sortedUsers = usersWithScores.sort((a, b) => b.averageScore - a.averageScore);
//           setUsers(sortedUsers.filter(user => user.totalQuizzes > 0)); // Only show users who have taken quizzes
//         } catch (err) {
//           console.error(err);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchLeaderboard();
//     }, []);

//   if (loading) {
//     return <div className="text-center py-12">Loading leaderboard...</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <div className="flex items-center mb-6">
//         <TrophyIcon className="h-8 w-8 text-yellow-500 mr-2" />
//         <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
//       </div>
      
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-lg font-medium text-gray-900">Top Performers</h2>
//         </div>
//         {users.length === 0 ? (
//           <div className="p-6 text-center text-gray-500">
//             No users found
//           </div>
//         ) : (
//           <ul className="divide-y divide-gray-200">
//             {users.map((user, index) => (
//               <li key={user.id} className="p-4 hover:bg-gray-50">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
//                     {index + 1}
//                   </div>
//                   <div className="ml-4 flex-1">
//                     <h3 className="text-md font-medium text-gray-900">
//                       {user.name || 'Anonymous'}
//                       {user.email && <span className="text-xs text-gray-500 ml-2">({user.email})</span>}
//                     </h3>
//                     <div className="flex items-center mt-1">
//                       <ChartBarIcon className="h-4 w-4 text-gray-400 mr-1" />
//                       <span className="text-sm text-gray-500">
//                         Average score: {user.averageScore}% ({user.totalQuizzes} quizzes)
//                       </span>
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                       user.averageScore >= 80 ? 'bg-green-100 text-green-800' :
//                       user.averageScore >= 60 ? 'bg-blue-100 text-blue-800' :
//                       user.averageScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {user.averageScore}%
//                     </span>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Leaderboard;

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { TrophyIcon, ChartBarIcon, UserIcon } from '@heroicons/react/24/outline';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Get all users from the users collection
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Get results for each user and calculate average score
        const usersWithScores = await Promise.all(
          usersData.map(async (user) => {
            const resultsQuery = query(
              collection(db, 'results'),
              where('userId', '==', user.id)
            );
            const resultsSnapshot = await getDocs(resultsQuery);
            const results = resultsSnapshot.docs.map(doc => doc.data());
            
            const totalQuizzes = results.length;
            const totalScore = results.reduce((sum, result) => sum + result.score, 0);
            const totalPossible = results.reduce((sum, result) => sum + result.totalQuestions, 0);
            const averageScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

            return {
              ...user,
              totalQuizzes,
              averageScore
            };
          })
        );

        // Sort by average score (descending)
        const sortedUsers = usersWithScores.sort((a, b) => b.averageScore - a.averageScore);
        setUsers(sortedUsers.filter(user => user.totalQuizzes > 0)); // Only show users who have taken quizzes
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper function to get medal emoji for top positions
  const getMedalForPosition = (position) => {
    switch(position) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return null;
    }
  };

  // Helper function to get background color based on score
  const getScoreBadgeStyles = (score) => {
    if (score >= 90) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 50) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="bg-gradient-to-r from-amber-100 to-amber-200 p-4 rounded-full mb-4 shadow-md">
          <TrophyIcon className="h-10 w-10 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600 max-w-md">
          See how you rank among other quiz takers based on average scores
        </p>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-sky-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Top Performers</h2>
            <span className="text-sm text-gray-500">{users.length} participants</span>
          </div>
        </div>
        
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
              <UserIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No quiz results found yet</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to complete a quiz and appear here!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {users.map((user, index) => {
              const medal = getMedalForPosition(index);
              const scoreBadgeStyles = getScoreBadgeStyles(user.averageScore);
              
              return (
                <li key={user.id} className={`hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-gray-50 to-white' : ''}`}>
                  <div className="flex items-center p-5">
                    <div className="flex-shrink-0 mr-4">
                      {medal ? (
                        <div className="w-10 h-10 flex items-center justify-center text-2xl">
                          {medal}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-md font-semibold text-gray-900 truncate">
                        {user.name || 'Anonymous'}
                      </h3>
                      {user.email && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {user.email}
                        </p>
                      )}
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <ChartBarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span>
                          {user.totalQuizzes} {user.totalQuizzes === 1 ? 'quiz' : 'quizzes'} completed
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col items-end">
                      <div className={`px-3 py-1 border rounded-full font-medium text-sm ${scoreBadgeStyles}`}>
                        {user.averageScore}%
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        Average score
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Complete more quizzes to improve your ranking!</p>
      </div>
    </div>
  );
};

export default Leaderboard;