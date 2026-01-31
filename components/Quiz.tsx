
import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants.tsx';
import { SenseId } from '../types';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState(() => [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (selectedId: SenseId) => {
    if (isPaused) return;
    const question = questions[currentQuestionIdx];
    const isCorrect = selectedId === question.correctSenseId;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ isCorrect: true, text: 'כל הכבוד! תשובה נכונה.' });
      speak('כל הכבוד! תשובה נכונה.');
    } else {
      setFeedback({ isCorrect: false, text: 'לא נורא, נסו שוב בשאלה הבאה.' });
      speak('לא נורא, נסו שוב בשאלה הבאה.');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIdx < questions.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
      } else {
        setShowResult(true);
        speak(`סיימתם! הציון שלכם הוא ${score + (isCorrect ? 1 : 0)} מתוך ${questions.length}`);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setQuestions([...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
    setIsPaused(false);
    speak('התחלנו מחדש! בהצלחה.');
  };

  if (showResult) {
    return (
      <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl text-center max-w-lg mx-auto border-4 border-blue-500 animate-zoom-in">
        <h2 className="text-4xl font-black mb-4 text-gray-800 dark:text-white">סיימתם את האתגר! 🎉</h2>
        <p className="text-3xl mb-8 font-bold text-gray-700 dark:text-gray-300">הישג: {score} מתוך {questions.length}</p>
        <button onClick={resetQuiz} className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-2xl hover:scale-105 transition-all shadow-xl">נסו שוב</button>
      </div>
    );
  }

  const question = questions[currentQuestionIdx];

  return (
    <div className={`bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-2xl mx-auto border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all duration-300 ${isPaused ? 'filter blur-sm pointer-events-none' : ''}`}>
      {/* Quiz UI */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-black text-blue-600 uppercase tracking-widest">שאלה {currentQuestionIdx + 1} מתוך {questions.length}</span>
          <button onClick={() => speak(question.scenario)} className="text-2xl opacity-50 hover:opacity-100 transition-all">🔊 הקרא שאלה</button>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white leading-tight">{question.scenario}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option) => (
          <button
            key={option.id}
            disabled={!!feedback}
            onClick={() => handleAnswer(option.id)}
            onMouseEnter={() => speak(option.label)}
            className={`p-6 rounded-2xl text-right font-black transition-all border-2 text-xl active:scale-95 ${
              feedback ? 'opacity-30' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-100 dark:border-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-12 flex justify-between items-center">
        <button onClick={() => setIsPaused(true)} className="text-gray-400 font-bold hover:text-gray-600">⏸️ השהה</button>
        <button onClick={resetQuiz} className="text-red-400 font-bold hover:text-red-600">🔄 אפס מבחן</button>
      </div>

      {feedback && (
        <div className={`absolute inset-0 flex items-center justify-center z-50 transition-all ${feedback.isCorrect ? 'bg-green-600/90' : 'bg-red-600/90'}`}>
          <div className="text-white text-center p-8 animate-zoom-in">
            <span className="text-8xl block mb-6">{feedback.isCorrect ? '🌟' : '💡'}</span>
            <p className="text-4xl font-black">{feedback.text}</p>
          </div>
        </div>
      )}

      {isPaused && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
          <button onClick={() => setIsPaused(false)} className="bg-white text-blue-800 p-8 rounded-full shadow-2xl hover:scale-110 transition-all text-5xl">▶️</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
