// const Loading = () => {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   };
  
//   export default Loading;

import { useState, useEffect } from 'react';

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev < 100 ? prev + 1 : 0);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 opacity-20"></div>
        
        {/* Spinning border */}
        <div className="w-32 h-32 rounded-full border-t-4 border-r-4 border-indigo-500 animate-spin"></div>
        
        {/* Inner spinning border (opposite direction) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-b-4 border-l-4 border-pink-500 animate-spin animate-reverse"></div>
        </div>
        
        {/* Pulsing center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-indigo-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Progress text */}
      <div className="mt-8 text-xl font-medium tracking-wider">
        LOADING
      </div>
      
      {/* Progress bar */}
      <div className="w-48 h-1 mt-4 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Dots */}
      <div className="flex mt-4 space-x-2">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;