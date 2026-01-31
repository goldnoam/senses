
import React, { useState, useEffect, useRef } from 'react';
import { SENSES_DATA } from './constants.tsx';
import { SenseData, FontSize } from './types';
import SenseCard from './components/SenseCard';
import SenseDetail from './components/SenseDetail';
import Quiz from './components/Quiz';
import Printables from './components/Printables';
import IntroSplash from './components/IntroSplash';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('introPlayed');
    }
    return true;
  });
  const [selectedSenseId, setSelectedSenseId] = useState<string | null>(null);
  const [navDirection, setNavDirection] = useState<'next' | 'prev'>('next');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPrintables, setShowPrintables] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default Dark
  const [fontSize, setFontSize] = useState<FontSize>('m');

  const selectedSenseIndex = SENSES_DATA.findIndex(s => s.id === selectedSenseId);
  const selectedSense = SENSES_DATA[selectedSenseIndex];

  // TTS Functionality
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    document.documentElement.className = isDarkMode ? 'dark' : '';
    document.body.className = `${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} font-size-${fontSize}`;
  }, [isDarkMode, fontSize]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('introPlayed', 'true');
    speak("ברוכים הבאים למסע בחמשת החושים! בואו נתחיל ללמוד.");
  };

  const navigateSense = (direction: 'next' | 'prev') => {
    setNavDirection(direction);
    let newIndex = direction === 'next' ? selectedSenseIndex + 1 : selectedSenseIndex - 1;
    if (newIndex < 0) newIndex = SENSES_DATA.length - 1;
    if (newIndex >= SENSES_DATA.length) newIndex = 0;
    setSelectedSenseId(SENSES_DATA[newIndex].id);
    speak(`חוש ה${SENSES_DATA[newIndex].name}`);
  };

  const resetView = () => {
    setSelectedSenseId(null);
    setShowQuiz(false);
    setShowPrintables(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300">
      {showIntro && <IntroSplash onComplete={handleIntroComplete} />}
      
      <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" 
            onClick={resetView}
            onMouseEnter={() => speak("חזרה לדף הבית")}
          >
            <span className="text-3xl" aria-hidden="true">🧩</span>
            <span className="text-2xl font-black text-gray-800 dark:text-white">חמשת החושים</span>
          </button>

          {/* Accessibility Controls */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            {(['s', 'm', 'l'] as FontSize[]).map(size => (
              <button 
                key={size}
                onClick={() => setFontSize(size)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${fontSize === size ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
                title={`גודל גופן: ${size}`}
              >
                {size === 's' ? 'א' : size === 'm' ? 'א+' : 'א++'}
              </button>
            ))}
          </div>
        </div>
        
        <nav className="flex items-center gap-4 md:gap-6" aria-label="תפריט ראשי">
          <button onClick={() => { resetView(); speak("דפי עבודה"); setShowPrintables(true); }} className="text-gray-600 dark:text-gray-300 font-bold hover:text-blue-600 transition-all px-2">דפי עבודה</button>
          <button onClick={() => { resetView(); speak("משימת אתגר"); setShowQuiz(true); }} className="bg-blue-600 text-white font-bold px-5 py-2 rounded-full hover:bg-blue-700 transition-all active:scale-95 shadow-lg">משימת אתגר</button>
          <button onClick={() => { setIsDarkMode(!isDarkMode); speak("שינוי צבעי האתר"); }} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-xl shadow-inner">{isDarkMode ? '☀️' : '🌙'}</button>
        </nav>
      </header>

      <main id="main-content" className="flex-grow">
        {selectedSense ? (
          <SenseDetail 
            sense={selectedSense} 
            direction={navDirection}
            onBack={resetView}
            onNext={() => navigateSense('next')}
            onPrev={() => navigateSense('prev')}
          />
        ) : showQuiz ? (
          <div className="py-20 px-6">
            <Quiz />
            <div className="mt-12 text-center">
              <button onClick={resetView} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">חזרה לדף הבית</button>
            </div>
          </div>
        ) : showPrintables ? (
          <div className="py-20 px-6 bg-indigo-50/20 dark:bg-indigo-950/5 min-h-screen">
             <Printables />
             <div className="mt-16 text-center">
                <button onClick={resetView} className="bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 px-10 py-4 rounded-full font-black shadow-lg hover:scale-105 active:scale-95 transition-all">חזרה לדף הבית</button>
             </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <section className="relative py-24 md:py-32 px-6 overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900 text-white text-center md:text-right">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                  <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight animate-slide-up">איך אנחנו מרגישים את העולם?</h1>
                  <p className="text-2xl md:text-3xl opacity-80 mb-12 max-w-2xl leading-relaxed">בואו למסע מרגש בין העיניים, האוזניים והידיים! נגלה איך חמשת החושים שלנו עובדים יחד.</p>
                  <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                    <button onClick={() => { speak("בואו נתחיל ללמוד"); document.getElementById('senses')?.scrollIntoView({behavior:'smooth'}); }} className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95">בואו נתחיל ללמוד</button>
                  </div>
                </div>
                <div className="flex-1 hidden md:grid grid-cols-2 gap-6 opacity-30">
                  {['👁️', '👂', '👃', '✋'].map(icon => <div key={icon} className="text-9xl grayscale hover:grayscale-0 transition-all cursor-default">{icon}</div>)}
                </div>
              </div>
            </section>

            <section id="senses" className="py-24 px-6 max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-gray-800 dark:text-white mb-4">בחרו חוש לגלות</h2>
                <div className="h-2 w-24 bg-blue-600 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {SENSES_DATA.map(sense => (
                  <SenseCard key={sense.id} sense={sense} onClick={(id) => { setSelectedSenseId(id); speak(`חוש ה${sense.name}`); }} />
                ))}
              </div>
            </section>

            <section className="bg-indigo-600 dark:bg-indigo-800 py-20 px-6 text-white text-center">
               <div className="max-w-4xl mx-auto">
                 <h2 className="text-4xl font-black mb-6">רוצים להמשיך ללמוד בכיף?</h2>
                 <p className="text-xl opacity-80 mb-10">הכנו עבורכם דפי עבודה, מבוכים ודפי צביעה להדפסה ביתית.</p>
                 <button onClick={() => { setShowPrintables(true); speak("לכל דפי העבודה"); }} className="bg-white text-indigo-800 px-12 py-5 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">לכל דפי העבודה 🖨️</button>
               </div>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 dark:bg-black text-gray-600 dark:text-gray-400 py-12 px-6 border-t border-gray-200 dark:border-white/5" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">חמשת החושים</p>
            <p className="text-sm">לימוד חווייתי ונגיש לילדים.</p>
            <p className="mt-4 font-bold text-blue-600 dark:text-blue-400">© Noam Gold AI 2026</p>
          </div>
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="font-bold text-gray-800 dark:text-gray-200">Send Feedback / צרו קשר</p>
            <a href="mailto:goldnoamai@gmail.com" className="text-lg hover:text-blue-600 transition-colors font-mono">goldnoamai@gmail.com</a>
          </div>
          
          <div className="flex gap-4">
            <span className="text-3xl opacity-50">👁️</span>
            <span className="text-3xl opacity-50">👂</span>
            <span className="text-3xl opacity-50">👃</span>
            <span className="text-3xl opacity-50">👅</span>
            <span className="text-3xl opacity-50">✋</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
