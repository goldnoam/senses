
import React, { useState, useEffect } from 'react';
import { SENSES_DATA } from './constants.tsx';
import { FontSize } from './types';
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>('m');

  const selectedSenseIndex = SENSES_DATA.findIndex(s => s.id === selectedSenseId);
  const selectedSense = SENSES_DATA[selectedSenseIndex];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    document.documentElement.className = isDarkMode ? 'dark' : '';
    document.body.className = `transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} font-size-${fontSize}`;
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
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {showIntro && <IntroSplash onComplete={handleIntroComplete} />}
      
      <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md sticky top-0 z-[100] border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-6">
          <button 
            className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" 
            onClick={resetView}
            onMouseEnter={() => speak("חזרה לדף הבית")}
          >
            <span className="text-3xl" aria-hidden="true">🧩</span>
            <span className="text-2xl font-black text-gray-800 dark:text-white">חמשת החושים</span>
          </button>

          <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-2xl shadow-inner">
            {(['s', 'm', 'l'] as FontSize[]).map(size => (
              <button 
                key={size}
                onClick={() => { setFontSize(size); speak(`שינוי גודל טקסט`); }}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${fontSize === size ? 'bg-blue-600 text-white shadow-lg scale-110' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                title={`גודל גופן: ${size}`}
              >
                {size === 's' ? 'א' : size === 'm' ? 'א+' : 'א++'}
              </button>
            ))}
          </div>
        </div>
        
        <nav className="flex items-center gap-4 md:gap-8" aria-label="תפריט ראשי">
          <button onClick={() => { resetView(); speak("דפי עבודה"); setShowPrintables(true); }} className="text-gray-600 dark:text-gray-300 font-bold hover:text-blue-600 transition-all text-lg">דפי עבודה</button>
          <button onClick={() => { resetView(); speak("משימת אתגר"); setShowQuiz(true); }} className="bg-blue-600 text-white font-black px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl">משימת אתגר</button>
          <button onClick={() => { setIsDarkMode(!isDarkMode); speak("שינוי צבעי האתר"); }} className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-2xl shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">{isDarkMode ? '☀️' : '🌙'}</button>
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
          <div className="py-20 px-6 max-w-4xl mx-auto">
            <Quiz />
            <div className="mt-12 text-center">
              <button onClick={resetView} className="text-blue-600 dark:text-blue-400 font-black hover:underline text-xl">חזרה לדף הבית</button>
            </div>
          </div>
        ) : showPrintables ? (
          <div className="py-20 px-6 bg-indigo-50/20 dark:bg-indigo-950/5 min-h-screen">
             <Printables />
             <div className="mt-16 text-center">
                <button onClick={resetView} className="bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 border-2 border-indigo-100 dark:border-indigo-900 px-12 py-5 rounded-3xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl">חזרה לדף הבית</button>
             </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <section className="relative py-24 md:py-40 px-6 overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-gray-950 text-white text-center md:text-right border-b border-white/5">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="flex-1">
                  <h1 className="text-6xl md:text-9xl font-black mb-10 leading-tight animate-slide-up">איך אנחנו מרגישים את העולם?</h1>
                  <p className="text-2xl md:text-4xl opacity-80 mb-16 max-w-3xl leading-relaxed">בואו למסע מרגש בין העיניים, האוזניים והידיים! נגלה איך חמשת החושים שלנו עובדים יחד.</p>
                  <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                    <button onClick={() => { speak("בואו נתחיל ללמוד"); document.getElementById('senses')?.scrollIntoView({behavior:'smooth'}); }} className="bg-blue-600 text-white px-14 py-6 rounded-[2rem] font-black text-2xl shadow-2xl hover:scale-105 hover:bg-blue-500 transition-all active:scale-95">בואו נתחיל ללמוד</button>
                  </div>
                </div>
                <div className="flex-1 hidden md:grid grid-cols-2 gap-10 opacity-20 select-none">
                  {['👁️', '👂', '👃', '✋', '👅', '🧠'].map((icon, i) => (
                    <div key={i} className={`text-[10rem] flex items-center justify-center animate-pulse-subtle`} style={{ animationDelay: `${i * 300}ms` }}>{icon}</div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            </section>

            <section id="senses" className="py-24 px-6 max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-black text-gray-800 dark:text-white mb-6">בחרו חוש לגלות</h2>
                <div className="h-2 w-32 bg-blue-600 mx-auto rounded-full shadow-lg shadow-blue-500/50"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                {SENSES_DATA.map(sense => (
                  <SenseCard key={sense.id} sense={sense} onClick={(id) => { setSelectedSenseId(id); speak(`חוש ה${sense.name}`); }} />
                ))}
              </div>
            </section>

            <section className="bg-blue-600 dark:bg-blue-800 py-24 px-6 text-white text-center relative overflow-hidden">
               <div className="max-w-4xl mx-auto relative z-10">
                 <h2 className="text-5xl font-black mb-8">רוצים להמשיך ללמוד בכיף?</h2>
                 <p className="text-2xl opacity-90 mb-14 max-w-2xl mx-auto leading-relaxed">הכנו עבורכם דפי עבודה, מבוכים ודפי צביעה מקצועיים להדפסה ביתית.</p>
                 <button onClick={() => { setShowPrintables(true); speak("לכל דפי העבודה"); }} className="bg-white text-blue-800 px-16 py-6 rounded-[2rem] font-black text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">לכל דפי העבודה 🖨️</button>
               </div>
               <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
               <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 dark:bg-black text-gray-600 dark:text-gray-400 py-20 px-6 border-t border-gray-200 dark:border-white/5" role="contentinfo">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-right">
            <p className="text-3xl font-black text-gray-900 dark:text-white mb-4">חמשת החושים - מסע לימודי</p>
            <p className="text-lg opacity-80 max-w-md">פלטפורמה חינוכית ללימוד חווייתי של חושי האדם. מונגש, אינטראקטיבי ומהנה לכל הגילאים.</p>
            <p className="mt-10 font-black text-blue-600 dark:text-blue-400 text-xl tracking-tight">© Noam Gold AI 2026</p>
          </div>
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="font-black text-gray-800 dark:text-gray-200 text-xl">שלחו לנו משוב</p>
            <a href="mailto:goldnoamai@gmail.com" className="text-2xl hover:text-blue-600 transition-colors font-bold border-b-4 border-blue-500/20 pb-1">goldnoamai@gmail.com</a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {['👁️', '👂', '👃', '👅', '✋'].map(icon => <span key={icon} className="text-5xl">{icon}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
