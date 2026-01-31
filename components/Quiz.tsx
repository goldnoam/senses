
import React, { useState, useMemo } from 'react';
import { QUIZ_QUESTIONS } from '../constants.tsx';
import { SenseId } from '../types';

const Quiz: React.FC = () => {
  // Randomize questions order on component mount and provide a reset mechanism
  const [questions, setQuestions] = useState(() => 
    [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const handleAnswer = (selectedId: SenseId) => {
    const question = questions[currentQuestionIdx];
    const isCorrect = selectedId === question.correctSenseId;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ isCorrect: true, text: 'כל הכבוד! תשובה נכונה.' });
    } else {
      setFeedback({ isCorrect: false, text: 'לא נורא, נסו שוב בשאלה הבאה.' });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIdx < questions.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1800);
  };

  const resetQuiz = () => {
    setQuestions([...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
  };

  if (showResult) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl text-center max-w-lg mx-auto border-4 border-yellow-500" role="alert" aria-live="polite">
        <h2 className="text-4xl font-black mb-4 text-gray-800 dark:text-white">סיימתם את האתגר! 🎉</h2>
        <p className="text-2xl mb-6 font-bold text-gray-700 dark:text-gray-300">צברתם {score} מתוך {questions.length} נקודות.</p>
        <button 
          onClick={resetQuiz}
          className="bg-blue-700 text-white px-8 py-4 rounded-full font-black text-xl hover:bg-blue-800 transition-colors shadow-lg focus:ring-4 focus:ring-blue-300 active:scale-95"
          aria-label="התחל את המבחן מחדש"
        >
          נסו שוב
        </button>
      </div>
    );
  }

  const question = questions[currentQuestionIdx];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-3xl shadow-xl max-w-2xl mx-auto border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors duration-300" role="form" aria-labelledby="question-heading">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest" aria-hidden="true">שאלה {currentQuestionIdx + 1} מתוך {questions.length}</span>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">הישג: {score}</span>
        </div>
        <span className="sr-only">שאלה מספר {currentQuestionIdx + 1} מתוך {questions.length} שאלות</span>
        <h2 id="question-heading" className="text-2xl font-bold mt-2 text-gray-800 dark:text-white leading-relaxed">{question.scenario}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4" role="radiogroup" aria-label="בחר את החוש הנכון">
        {question.options.map((option) => (
          <button
            key={option.id}
            disabled={!!feedback}
            onClick={() => handleAnswer(option.id)}
            className={`p-4 rounded-xl text-right font-bold transition-all border-2 text-lg active:scale-98 active:brightness-95 ${
              feedback ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-400 border-gray-100 dark:border-gray-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 dark:text-gray-200'
            }`}
            aria-label={`בחר ${option.label}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {feedback && (
        <div 
          className={`absolute inset-0 flex items-center justify-center z-20 transition-all ${feedback.isCorrect ? 'bg-green-600/95' : 'bg-red-600/95'}`}
          role="status"
          aria-live="assertive"
        >
          <div className="text-white text-center p-6 animate-in zoom-in duration-300">
            <span className="text-7xl block mb-4" aria-hidden="true">{feedback.isCorrect ? '🌟' : '💡'}</span>
            <p className="text-3xl font-black">{feedback.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
