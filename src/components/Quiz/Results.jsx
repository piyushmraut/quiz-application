import { useLocation } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Results = () => {
  const location = useLocation();
  const { score, totalQuestions, answers, questions } = location.state || {};

  if (!location.state) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No results to display</p>
      </div>
    );
  }

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Results</h1>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">Your score:</p>
              <p className="text-3xl font-bold">
                {score} / {totalQuestions}
              </p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Question Review</h2>
        </div>
        {questions.map((question, index) => (
          <div key={index} className="p-6 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start">
              {answers[index] === question.correctAnswer ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-1" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-1" />
              )}
              <div>
                <h3 className="text-md font-medium text-gray-900">{question.text}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Your answer: {question.options[answers[index]]}
                  </p>
                  {answers[index] !== question.correctAnswer && (
                    <p className="text-sm text-gray-600">
                      Correct answer: {question.options[question.correctAnswer]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;