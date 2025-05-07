import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';

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

  if (loading) {
    return <div className="text-center py-12">Loading leaderboard...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <TrophyIcon className="h-8 w-8 text-yellow-500 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Top Performers</h2>
        </div>
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No users found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <li key={user.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-md font-medium text-gray-900">
                      {user.name || 'Anonymous'}
                      {user.email && <span className="text-xs text-gray-500 ml-2">({user.email})</span>}
                    </h3>
                    <div className="flex items-center mt-1">
                      <ChartBarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        Average score: {user.averageScore}% ({user.totalQuizzes} quizzes)
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.averageScore >= 80 ? 'bg-green-100 text-green-800' :
                      user.averageScore >= 60 ? 'bg-blue-100 text-blue-800' :
                      user.averageScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.averageScore}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;