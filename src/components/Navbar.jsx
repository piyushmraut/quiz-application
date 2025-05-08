// import { Link, useNavigate } from "react-router-dom";
// import { auth, db } from "../firebase";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { ArrowLeftOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { useAuth } from '../context/AuthContext';

// const Navbar = () => {
//   const [user] = useAuthState(auth);
//   // const [userData, setUserData] = useState(null);
//   // const navigate = useNavigate();
//   const { currentUser, userData, isAdmin } = useAuth();
//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, "users", user.uid));
//           if (userDoc.exists()) {
//             setUserData(userDoc.data());
//           }
//         } catch (err) {
//           console.error("Error fetching user data:", err);
//         }
//       }
//     };

//     fetchUserData();
//   }, [user]);

//   const handleLogout = () => {
//     auth.signOut();
//     navigate("/login");
//   };

//   const displayName = () => {
//     if (userData?.name) return userData.name;
//     if (user?.displayName) return user.displayName;
//     if (user?.email) return user.email.split("@")[0];
//     return "User";
//   };

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <div className="flex-shrink-0 flex items-center">
//               <Link
//                 to="/dashboard"
//                 className="text-xl font-bold text-indigo-600"
//               >
//                 QuizApp
//               </Link>
//             </div>
//             {user && (
//         <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//           <Link
//             to="/dashboard"
//             className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//           >
//             Dashboard
//           </Link>
//           <Link
//             to="/leaderboard"
//             className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//           >
//             Leaderboard
//           </Link>
//           {isAdmin && (
//             <Link
//               to="/create-quiz"
//               className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//             >
//               Create Quiz
//             </Link>
//           )}
//           <Link
//             to="/quizzes"
//             className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//           >
//             Quizzes
//           </Link>
//         </div>
//       )}
//           </div>
//           {user && (
//             <div className="hidden sm:ml-6 sm:flex sm:items-center">
//               <div className="flex items-center mr-4">
//                 <UserCircleIcon className="h-8 w-8 text-gray-400 mr-2" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">
//                     {displayName()}
//                   </p>
//                   <p className="text-xs text-gray-500">{user.email}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 <ArrowLeftOnRectangleIcon className="-ml-1 mr-2 h-5 w-5" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { 
  ArrowLeftOnRectangleIcon, 
  UserCircleIcon,
  HomeIcon,
  TrophyIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import { motion } from "framer-motion";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const { currentUser, userData, isAdmin } = useAuth();
  const [isHovering, setIsHovering] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const displayName = () => {
    if (userData?.name) return userData.name;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: HomeIcon,
      show: true
    },
    { 
      name: "Leaderboard", 
      path: "/leaderboard", 
      icon: TrophyIcon,
      show: true
    },
    { 
      name: "Create Quiz", 
      path: "/create-quiz", 
      icon: PlusCircleIcon,
      show: isAdmin
    },
    { 
      name: "Quizzes", 
      path: "/quizzes", 
      icon: DocumentTextIcon,
      show: true
    }
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/dashboard" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 20 }}
                whileTap={{ scale: 0.9 }}
              >
                <SparklesIcon className="h-8 w-8 text-white" />
              </motion.div>
              <span className="text-2xl font-bold text-white font-mono tracking-tight">
                QuizWiz
              </span>
            </Link>
          </motion.div>

          {user && (
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                item.show && (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="relative group"
                    onMouseEnter={() => setIsHovering(item.name)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <motion.div
                      className="flex items-center px-3 py-2 rounded-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      <item.icon className={`h-6 w-6 ${isHovering === item.name ? 'text-yellow-300' : 'text-white'}`} />
                      <span className={`ml-2 text-lg font-medium ${isHovering === item.name ? 'text-yellow-300' : 'text-white'}`}>
                        {item.name}
                      </span>
                    </motion.div>
                    {isHovering === item.name && (
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300 rounded-full"
                        layoutId="underline"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </Link>
                )
              ))}
            </div>
          )}

          {user && (
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  <UserCircleIcon className="h-10 w-10 text-white" />
                  {isAdmin && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-yellow-400 text-xs font-bold rounded-full px-1.5 py-0.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      ★
                    </motion.span>
                  )}
                </motion.div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {displayName()}
                  </p>
                  <p className="text-xs text-indigo-100">{user.email}</p>
                </div>
              </div>
              
              <motion.button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium">Logout</span>
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Mobile menu */}
        {user && (
          <div className="md:hidden flex justify-around py-3 bg-indigo-700 bg-opacity-50 rounded-lg mt-2">
            {navItems.map((item) => (
              item.show && (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex flex-col items-center px-2"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full"
                  >
                    <item.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <span className="text-xs text-white mt-1">{item.name}</span>
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;