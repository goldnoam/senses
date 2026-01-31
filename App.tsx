
import React, { useState, useEffect, useRef } from 'react';
import { SENSES_DATA } from './constants.tsx';
import { SenseData } from './types';
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
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedSenseIndex = SENSES_DATA.findIndex(s => s.id === selectedSenseId);
  const selectedSense = SENSES_DATA[selectedSenseIndex];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSenseId, showQuiz, showPrintables]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('introPlayed', 'true');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.focus({ preventScroll: true });
    }
  };

  const navigateSense = (direction: 'next' | 'prev') => {
    setNavDirection(direction);
    let newIndex = direction === 'next' ? selectedSenseIndex + 1 : selectedSenseIndex - 1;
    if (newIndex < 0) newIndex = SENSES_DATA.length - 1;
    if (newIndex >= SENSES_DATA.length) newIndex = 0;
    setSelectedSenseId(SENSES_DATA[newIndex].id);
  };

  const scrollGrid = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const resetView = () => {
    setSelectedSenseId(null);
    setShowQuiz(false);
    setShowPrintables(false);
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {showIntro && <IntroSplash onComplete={handleIntroComplete} />}
      
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-[100]">
        דלג לתוכן המרכזי
      </a>

      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center" role="banner">
        <button 
          className="flex items-center gap-2 focus:ring-2 focus:ring-blue-500 rounded-lg p-1 transition-transform hover:scale-105 active:scale-95" 
          onClick={resetView}
          aria-label="חזרה לדף הבית"
        >
          <span className="text-3xl" aria-hidden="true">🧩</span>
          <span className="text-2xl font-black text-gray-800 dark:text-white">חמשת החושים</span>
        </button>
        
        <nav className="hidden md:flex items-center gap-6" aria-label="תפריט ראשי">
          <button onClick={() => { resetView(); scrollToSection('home'); }} className="text-gray-600 dark:text-gray-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-all focus:ring-2 focus:ring-blue-500 rounded-md px-2">בית</button>
          <button onClick={() => { resetView(); scrollToSection('senses'); }} className="text-gray-600 dark:text-gray-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-all focus:ring-2 focus:ring-blue-500 rounded-md px-2">החושים</button>
          <button onClick={() => { resetView(); setShowPrintables(true); }} className="text-gray-600 dark:text-gray-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-all focus:ring-2 focus:ring-blue-500 rounded-md px-2">דפי עבודה</button>
          <button onClick={() => { resetView(); setShowQuiz(true); }} className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95 focus:ring-2 focus:ring-blue-500">משימת אתגר</button>
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-xl" aria-label="החלף מצב תצוגה">{isDarkMode ? '☀️' : '🌙'}</button>
        </nav>

        <button onClick={toggleDarkMode} className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-xl" aria-label="החלף מצב תצוגה">{isDarkMode ? '☀️' : '🌙'}</button>
      </header>

      <main id="main-content" className="flex-grow" tabIndex={-1}>
        {selectedSense ? (
          <SenseDetail 
            sense={selectedSense} 
            direction={navDirection}
            onBack={() => setSelectedSenseId(null)}
            onNext={() => navigateSense('next')}
            onPrev={() => navigateSense('prev')}
          />
        ) : showQuiz ? (
          <div className="py-20 px-6">
            <Quiz />
            <div className="mt-12 text-center">
              <button onClick={() => setShowQuiz(false)} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">חזרה לדף הבית</button>
            </div>
          </div>
        ) : showPrintables ? (
          <div className="py-20 px-6 bg-indigo-50/50 dark:bg-indigo-950/10 min-h-screen">
             <Printables />
             <div className="mt-16 text-center">
                <button onClick={() => setShowPrintables(false)} className="bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 px-10 py-4 rounded-full font-black shadow-lg hover:shadow-xl transition-all active:scale-95">חזרה לדף הבית</button>
             </div>
          </div>
        ) : (
          <>
            <section id="home" className="relative py-24 md:py-32 px-6 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-950 text-white">
              <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 text-center md:text-right">
                  <h1 className="text-6xl md:text-8xl font-black leading-tight mb-8">איך אנחנו מרגישים את העולם?</h1>
                  <p className="text-2xl md:text-3xl opacity-90 mb-12 max-w-2xl leading-relaxed font-light">בואו למסע מרגש בין העיניים, האוזניים והידיים! נגלה איך חמשת החושים שלנו עובדים יחד.</p>
                  <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                    <button onClick={() => { setNavDirection('next'); scrollToSection('senses'); }} className="bg-white text-blue-800 px-10 py-5 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95">בואו נתחיל ללמוד</button>
                    <button onClick={() => setShowQuiz(true)} className="bg-yellow-400 text-gray-900 px-10 py-5 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95">למשימת האתגר</button>
                  </div>
                </div>
                <div className="flex-1 hidden md:flex justify-center" aria-hidden="true">
                   <div className="grid grid-cols-2 gap-6 animate-pulse duration-[4000ms]">
                      <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] text-8xl transition-all hover:scale-110 hover:bg-white/20">👁️</div>
                      <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] text-8xl mt-12 transition-all hover:scale-110 hover:bg-white/20">👂</div>
                      <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] text-8xl -mt-6 transition-all hover:scale-110 hover:bg-white/20">👃</div>
                      <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] text-8xl mt-6 transition-all hover:scale-110 hover:bg-white/20">✋</div>
                   </div>
                </div>
              </div>
            </section>

            <section id="senses" className="py-24 px-6 max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-black text-gray-800 dark:text-white mb-6">חמשת המופלאים</h2>
                <div className="h-2 w-32 bg-blue-600 mx-auto rounded-full mb-6"></div>
                <p className="text-2xl text-gray-600 dark:text-gray-400">בחרו חוש כדי לגלות עליו עוד</p>
              </div>

              <div ref={scrollContainerRef} className="flex overflow-x-auto pb-12 gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-5 no-scrollbar scroll-smooth">
                {SENSES_DATA.map(sense => (
                  <div key={sense.id} className="flex-shrink-0 w-[85vw] sm:w-auto">
                    <SenseCard sense={sense} onClick={(id) => { setNavDirection('next'); setSelectedSenseId(id); }} />
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-indigo-700 dark:bg-indigo-900 py-24 px-6 text-white text-center">
               <div className="max-w-4xl mx-auto">
                 <h2 className="text-5xl font-black mb-8">רוצים להמשיך ללמוד בכיף?</h2>
                 <p className="text-2xl opacity-90 mb-12">הכנו עבורכם דפי עבודה, מבוכים ודפי צביעה להדפסה ביתית.</p>
                 <button onClick={() => setShowPrintables(true)} className="bg-white text-indigo-800 px-12 py-5 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition-all active:scale-95">לכל דפי העבודה 🖨️</button>
               </div>
            </section>
          </>
        )}
      </main>

      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 left-8 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all animate-in fade-in slide-in-from-bottom-4 z-40" aria-label="חזרה לראש הדף">
          <span className="text-2xl">↑</span>
        </button>
      )}

      <footer className="bg-gray-900 dark:bg-black text-white py-16 px-6 text-center border-t border-white/5" role="contentinfo">
        <p className="text-xl font-bold mb-2">מסע בחמשת החושים</p>
        <p className="text-gray-500">© {new Date().getFullYear()} כל הזכויות שמורות. למידה חווייתית לילדים.</p>
      </footer>
    </div>
  );
};

export default App;
