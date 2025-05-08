// import { useState } from 'react';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { auth, db } from '../../firebase';
// import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

// const Signup = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (password !== confirmPassword) {
//       return setError('Passwords do not match');
//     }
    
//     setLoading(true);
//     setError('');
    
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       // Update user profile in Firebase Auth
//       await updateProfile(auth.currentUser, {
//         displayName: name
//       });
//       // Create user profile in Firestore
//       await setDoc(doc(db, 'users', userCredential.user.uid), {
//         name,
//         email,
//         createdAt: serverTimestamp(),
//         lastUpdated: serverTimestamp()
//       });
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create a new account
//           </h2>
//         </div>
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="name" className="sr-only">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <UserIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   autoComplete="name"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Full Name"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <EnvelopeIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Email address"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Password"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="confirm-password" className="sr-only">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="confirm-password"
//                   name="confirm-password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Confirm Password"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               {loading ? 'Creating account...' : 'Sign up'}
//             </button>
//           </div>
//         </form>
//         <div className="text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <button
//             onClick={() => navigate('/login')}
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Sign in
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// src/components/Auth/Signup.jsx
// import { useState } from 'react';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { auth, db } from '../../firebase';
// import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import { EnvelopeIcon, LockClosedIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// const Signup = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [role, setRole] = useState('user'); // Default to 'user'
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (password !== confirmPassword) {
//       return setError('Passwords do not match');
//     }
    
//     setLoading(true);
//     setError('');
    
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       // Update user profile in Firebase Auth
//       await updateProfile(auth.currentUser, {
//         displayName: name
//       });
//       // Create user profile in Firestore with role
//       await setDoc(doc(db, 'users', userCredential.user.uid), {
//         name,
//         email,
//         role, // Store the role
//         createdAt: serverTimestamp(),
//         lastUpdated: serverTimestamp()
//       });
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create a new account
//           </h2>
//         </div>
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="name" className="sr-only">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <UserIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   autoComplete="name"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Full Name"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <EnvelopeIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Email address"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Password"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="confirm-password" className="sr-only">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="confirm-password"
//                   name="confirm-password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Confirm Password"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                 Account Type
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <select
//                   id="role"
//                   name="role"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   required
//                 >
//                   <option value="user">Regular User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <p className="mt-1 text-xs text-gray-500">Admins can create quizzes</p>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               {loading ? 'Creating account...' : 'Sign up'}
//             </button>
//           </div>
//         </form>
//         <div className="text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <button
//             onClick={() => navigate('/login')}
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Sign in
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name
      });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    animate: { rotate: 360, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <motion.div
            className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.svg
              variants={iconVariants}
              initial="initial"
              animate="animate"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </motion.svg>
          </motion.div>
          <motion.h2 
            className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Create Your Account
          </motion.h2>
          <motion.p 
            className="mt-2 text-center text-sm text-gray-500"
            variants={itemVariants}
          >
            Join us to get started
          </motion.p>
        </motion.div>

        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <div className="space-y-5">
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <motion.div whileHover={iconVariants.animate}>
                    <UserIcon className="h-5 w-5 text-blue-500" />
                  </motion.div>
                </div>
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)" }}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <motion.div whileHover={iconVariants.animate}>
                    <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                  </motion.div>
                </div>
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)" }}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <motion.div whileHover={iconVariants.animate}>
                    <LockClosedIcon className="h-5 w-5 text-blue-500" />
                  </motion.div>
                </div>
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)" }}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="Create a password"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <motion.div whileHover={iconVariants.animate}>
                    <LockClosedIcon className="h-5 w-5 text-blue-500" />
                  </motion.div>
                </div>
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)" }}
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="Confirm your password"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <motion.div whileHover={iconVariants.animate}>
                    <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
                  </motion.div>
                </div>
                <motion.select
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)" }}
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  required
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Admin</option>
                </motion.select>
              </div>
              <p className="mt-1 text-xs text-gray-500">Admins can create quizzes</p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              {loading ? (
                <motion.svg 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </motion.svg>
              ) : (
                <>
                  Sign up
                  <motion.svg 
                    className="ml-2 -mr-1 w-4 h-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </motion.svg>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
        
        <motion.div 
          variants={itemVariants}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;