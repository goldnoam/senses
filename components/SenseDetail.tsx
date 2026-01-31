
import React, { useState, useEffect, useRef } from 'react';
import { SenseData, Example } from '../types';
import { PRINTABLES, PrintableResource } from '../constants';

interface SenseDetailProps {
  sense: SenseData;
  direction: 'next' | 'prev';
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const SenseDetail: React.FC<SenseDetailProps> = ({ sense, direction, onBack, onNext, onPrev }) => {
  const [headerLoaded, setHeaderLoaded] = useState(false);
  const [isWhatIsItVisible, setIsWhatIsItVisible] = useState(false);
  const [isExamplesVisible, setIsExamplesVisible] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [previewItem, setPreviewItem] = useState<PrintableResource | null>(null);

  const whatIsItRef = useRef<HTMLElement>(null);
  const examplesRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  const relatedPrintable = PRINTABLES.find(p => p.id === sense.printableId);

  useEffect(() => {
    containerRef.current?.focus();
    const observerOptions = { threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === whatIsItRef.current) setIsWhatIsItVisible(true);
          if (entry.target === examplesRef.current) setIsExamplesVisible(true);
        }
      });
    }, observerOptions);

    if (whatIsItRef.current) observer.observe(whatIsItRef.current);
    if (examplesRef.current) observer.observe(examplesRef.current);

    const timer = setTimeout(() => setShowSwipeHint(false), 4000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onNext();
      } else if (e.key === 'ArrowRight') {
        onPrev();
      } else if (e.key === 'Escape') {
        if (previewItem) setPreviewItem(null);
        else onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sense.id, onNext, onPrev, onBack, previewItem]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setShowSwipeHint(false); 
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    const threshold = 60;
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) onNext();
      else onPrev();
    }
    touchStartX.current = null;
  };

  const handleShare = async () => {
    const shareData = {
      title: `חמשת החושים: חוש ה${sense.name}`,
      text: `בואו ללמוד על חוש ה${sense.name} באתר חמשת החושים המקסים!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        alert('הקישור לדף הועתק ללוח!');
      }
    } catch (err) { console.error(err); }
  };

  const handlePrint = (imageUrl: string, title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl" lang="he">
        <head>
          <title>${title}</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Assistant', sans-serif; text-align: center; padding: 40px; background: white; }
            img { max-width: 100%; height: auto; border: 1px solid #eee; margin-bottom: 20px; }
            h1 { margin-top: 0; color: #333; font-size: 24px; margin-bottom: 20px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div>
            <h1>${title} - חמשת החושים</h1>
            <img src="${imageUrl}" alt="${title}" />
          </div>
          <script>
            window.onload = () => { setTimeout(() => { window.print(); }, 500); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const animationClass = direction === 'next' ? 'nav-next' : 'nav-prev';

  return (
    <article 
      key={sense.id} 
      ref={containerRef}
      className={`relative max-w-4xl mx-auto p-4 md:p-8 touch-pan-y focus:outline-none ${animationClass}`} 
      aria-labelledby="detail-title"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center text-blue-700 dark:text-blue-400 font-bold hover:underline group p-1 transition-all">
          <span className="ml-2 group-hover:translate-x-1 text-xl">→</span> חזרה לתפריט
        </button>
        <div className="flex gap-2">
           <button onClick={handleShare} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all">📤</button>
           <button onClick={onPrev} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all">❮</button>
           <button onClick={onNext} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all">❯</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <header className={`relative h-64 md:h-96 ${sense.color} flex items-center justify-center overflow-hidden`}>
          <img 
            src={sense.imageUrl} 
            alt="" 
            onLoad={() => setHeaderLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply dark:mix-blend-overlay transition-opacity duration-1000 ${headerLoaded ? 'opacity-50' : 'opacity-0'}`}
          />
          <div className="relative text-center text-white z-10 px-4">
            <div className="text-8xl mb-4 drop-shadow-2xl animate-bounce">{sense.icon}</div>
            <h1 id="detail-title" className="text-5xl md:text-7xl font-black drop-shadow-xl">חוש ה{sense.name}</h1>
            <p className="mt-4 text-2xl md:text-3xl font-bold drop-shadow-lg">האיבר: {sense.organ}</p>
          </div>
        </header>

        <div className="p-8 md:p-14">
          <section ref={whatIsItRef} className={`mb-14 transition-all duration-1000 transform ${isWhatIsItVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white border-r-8 border-blue-600 pr-4">מה זה בעצם?</h2>
            <p className="text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{sense.description}</p>
          </section>

          <section ref={examplesRef} className={`mb-16 transition-all duration-1000 delay-200 transform ${isExamplesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl font-bold mb-10 text-gray-800 dark:text-white border-r-8 border-blue-600 pr-4">דוגמאות מהחיים</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {sense.examples.map((example, idx) => (
                <ExampleItem key={`${sense.id}-ex-${idx}`} example={example} delay={idx * 150} />
              ))}
            </div>
          </section>

          {/* Worksheet Preview Section */}
          {relatedPrintable && (
            <section className="mb-16 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/20 p-8 md:p-12 rounded-[3rem] border-2 border-indigo-200/50 dark:border-indigo-800/50 flex flex-col md:flex-row items-center gap-12 animate-slide-up">
               <div className="flex-1 text-center md:text-right">
                  <div className="inline-block px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-black mb-6 uppercase tracking-widest shadow-lg">משימה לבית</div>
                  <h2 className="text-4xl font-black text-indigo-900 dark:text-indigo-200 mb-4 leading-tight">בואו נצבע ונלמד!</h2>
                  <p className="text-xl text-indigo-800/70 dark:text-indigo-300/70 mb-10 leading-relaxed">
                    הכנו דף {relatedPrintable.type} מיוחד לחוש ה{sense.name}.
                  </p>
                  <button 
                    onClick={() => setPreviewItem(relatedPrintable)}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-5 rounded-3xl shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 text-xl"
                  >
                    <span>🔍</span> תצוגה מקדימה והדפסה
                  </button>
               </div>
               
               <div className="w-full md:w-72 h-80 relative group cursor-pointer" onClick={() => setPreviewItem(relatedPrintable)}>
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-xl transition-all group-hover:rotate-3 border border-gray-200 p-2 overflow-hidden">
                    <img 
                      src={relatedPrintable.imageUrl} 
                      alt="" 
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100" 
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl shadow-lg animate-bounce">🖨️</div>
               </div>
            </section>
          )}

          <nav className="border-t-2 border-gray-100 dark:border-gray-700 pt-14 flex flex-col md:flex-row items-center justify-between gap-8">
             <button onClick={onPrev} className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-gray-100 dark:bg-gray-700 rounded-3xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition-all text-xl">❮ חוש קודם</button>
             <button onClick={onNext} className={`w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 ${sense.color} text-white rounded-3xl font-black shadow-xl hover:scale-105 transition-all text-xl`}>עבור לחוש הבא ❯</button>
          </nav>
        </div>
      </div>

      {/* MODAL PREVIEW - Fixed and Enhanced */}
      {previewItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setPreviewItem(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] w-full max-w-5xl h-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="md:w-3/5 h-[45vh] md:h-auto relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-6 md:p-16">
               <div className="bg-white rounded p-4 md:p-10 paper-shadow w-full h-full max-w-md flex items-center justify-center border border-gray-100 relative">
                  <div className="absolute top-0 right-0 left-0 h-1 bg-indigo-600/10"></div>
                  <img src={previewItem.imageUrl} alt={previewItem.title} className="max-w-full max-h-full object-contain" />
                  <div className="absolute bottom-4 right-4 text-[10px] text-gray-300 font-mono tracking-tighter">PDF_PREVIEW_A4</div>
               </div>
            </div>
            <div className="md:w-2/5 p-10 md:p-14 flex flex-col justify-center text-right">
               <div className="mb-10">
                  <span className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-black mb-4 uppercase">{previewItem.type}</span>
                  <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-6 leading-tight">{previewItem.title}</h2>
                  <p className="text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">ככה ייראה הדף המודפס שלכם. מוכנים?</p>
               </div>
               <div className="flex flex-col gap-6">
                 <button onClick={() => handlePrint(previewItem.imageUrl, previewItem.title)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 text-2xl">🖨️ הדפס עכשיו</button>
                 <button onClick={() => setPreviewItem(null)} className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold py-4 rounded-3xl hover:bg-gray-200 transition-all text-lg">חזרה ללמידה</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

const ExampleItem: React.FC<{ example: Example; delay: number }> = ({ example, delay }) => {
  const [loaded, setLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: -index * width, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group hover:shadow-2xl transition-all duration-500">
      <div className="relative h-64 bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div 
          ref={scrollRef}
          onScroll={() => scrollRef.current && setCurrentIndex(Math.abs(Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth)))}
          className="flex overflow-x-auto snap-inline no-scrollbar h-full"
        >
          {example.imageUrls.map((url, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
               <img 
                 src={url} 
                 alt={`${example.title} - ${idx + 1}`} 
                 onLoad={() => setLoaded(true)}
                 className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
               />
            </div>
          ))}
        </div>
        {example.imageUrls.length > 1 && (
          <>
            <button onClick={() => scrollTo(Math.max(0, currentIndex - 1))} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg ${currentIndex === 0 ? 'invisible' : 'visible'}`}>❯</button>
            <button onClick={() => scrollTo(Math.min(example.imageUrls.length - 1, currentIndex + 1))} className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg ${currentIndex === example.imageUrls.length - 1 ? 'invisible' : 'visible'}`}>❮</button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {example.imageUrls.map((_, idx) => (
                <button key={idx} onClick={() => scrollTo(idx)} className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-blue-600 w-4' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">{example.title}</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{example.description}</p>
      </div>
    </div>
  );
}

export default SenseDetail;
