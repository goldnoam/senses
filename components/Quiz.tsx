
import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../constants.tsx';
import { SenseId } from '../types';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState(() => [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      window.speechSynthesis.speak(utterance);
    }
  };

  const question = questions[currentQuestionIdx];

  useEffect(() => {
    if (question && !isPaused && !showResult && !feedback) {
      speak(question.scenario);
    }
  }, [currentQuestionIdx, isPaused]);

  const handleAnswer = (selectedId: SenseId) => {
    if (isPaused || feedback) return;
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
        setSelectedOptionIndex(0);
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
    setSelectedOptionIndex(0);
    speak('התחלנו מחדש! בהצלחה.');
  };

  if (showResult) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-[3.5rem] shadow-2xl text-center max-w-xl mx-auto border-8 border-blue-500 animate-zoom-in">
        <div className="text-8xl mb-8">🏆</div>
        <h2 className="text-5xl font-black mb-6 text-gray-800 dark:text-white">סיימתם את האתגר!</h2>
        <p className="text-4xl mb-12 font-bold text-gray-700 dark:text-gray-300">הישג: {score} מתוך {questions.length}</p>
        <button onClick={resetQuiz} className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-2xl hover:scale-105 transition-all shadow-2xl active:scale-95">נסו שוב מהתחלה</button>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className={`bg-white dark:bg-gray-800 p-10 md:p-16 rounded-[3.5rem] shadow-2xl border-4 border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all duration-500 ${isPaused ? 'filter blur-md grayscale pointer-events-none' : ''}`}>
        <div className="mb-12">
          <div className="flex justify-between items-center mb-10">
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-6 py-2 rounded-full shadow-inner">משימה {currentQuestionIdx + 1} מתוך {questions.length}</span>
            <button onClick={() => speak(question.scenario)} className="text-4xl p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900 transition-all shadow-md" title="הקרא שאלה">🔊</button>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white leading-[1.3] text-right">{question.scenario}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              disabled={!!feedback}
              onClick={() => handleAnswer(option.id)}
              onMouseEnter={() => { if(!feedback) speak(option.label); }}
              className={`p-8 rounded-[2rem] text-right font-black transition-all border-4 text-2xl active:scale-[0.98] ${
                feedback ? 'opacity-20' : 
                selectedOptionIndex === index ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-xl scale-[1.02]' : 'border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 shadow-md'
              }`}
            >
              <span className="ml-6 opacity-30 font-mono">0{index + 1}</span>
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-16 flex justify-between items-center border-t-4 border-gray-100 dark:border-gray-700 pt-10">
          <button onClick={() => setIsPaused(true)} className="flex items-center gap-4 text-gray-400 font-black hover:text-gray-600 dark:hover:text-gray-200 text-2xl group transition-all">
            <span className="p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl group-hover:scale-110">⏸️</span> השהה
          </button>
          <button onClick={resetQuiz} className="flex items-center gap-4 text-red-400 font-black hover:text-red-600 text-2xl group transition-all">
            <span className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl group-hover:scale-110">🔄</span> אתחל
          </button>
        </div>

        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center z-50 transition-all ${feedback.isCorrect ? 'bg-green-600/95' : 'bg-red-600/95'}`}>
            <div className="text-white text-center p-12 animate-zoom-in">
              <span className="text-[12rem] block mb-10 drop-shadow-2xl">{feedback.isCorrect ? '🌟' : '💡'}</span>
              <p className="text-6xl font-black drop-shadow-lg">{feedback.text}</p>
            </div>
          </div>
        )}

        {isPaused && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl pointer-events-auto">
            <button onClick={() => setIsPaused(false)} className="bg-white text-blue-800 p-12 rounded-full shadow-2xl hover:scale-125 transition-all text-7xl animate-pulse">▶️</button>
          </div>
        )}
      </div>

      {/* WASD NAVIGATION PAD FOR MOBILE/TOUCH */}
      <div className="mt-12 flex justify-center items-center gap-8 md:hidden">
        <button 
          onClick={() => setSelectedOptionIndex(prev => Math.max(0, prev - 1))}
          className="w-24 h-24 bg-gray-800 text-white rounded-[2rem] text-4xl font-black flex items-center justify-center shadow-2xl active:bg-blue-600 border-b-8 border-gray-900 active:border-b-0 active:translate-y-2 transition-all"
        >W</button>
        
        <button 
          onClick={() => handleAnswer(question.options[selectedOptionIndex].id)}
          className="w-32 h-32 bg-blue-600 text-white rounded-[2.5rem] text-3xl font-black flex items-center justify-center shadow-2xl active:bg-blue-700 border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 transition-all"
        >בחר</button>

        <button 
          onClick={() => setSelectedOptionIndex(prev => Math.min(question.options.length - 1, prev + 1))}
          className="w-24 h-24 bg-gray-800 text-white rounded-[2rem] text-4xl font-black flex items-center justify-center shadow-2xl active:bg-blue-600 border-b-8 border-gray-900 active:border-b-0 active:translate-y-2 transition-all"
        >S</button>
      </div>
    </div>
  );
};

export default Quiz;
