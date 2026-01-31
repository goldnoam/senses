
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
  const [previewItem, setPreviewItem] = useState<PrintableResource | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  const relatedPrintable = PRINTABLES.find(p => p.id === sense.printableId);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    containerRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onNext();
      else if (e.key === 'ArrowRight') onPrev();
      else if (e.key === 'Escape') {
        if (previewItem) setPreviewItem(null);
        else onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onBack, previewItem]);

  const handlePrint = (imageUrl: string, title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl" lang="he">
        <head><title>${title}</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:40px;}img{max-width:100%;height:auto;border:1px solid #eee;}</style></head>
        <body><img src="${imageUrl}" alt="${title}" /><script>window.onload=()=>{window.print();};</script></body>
      </html>
    `);
    printWindow.document.close();
  };

  const animationClass = direction === 'next' ? 'nav-next' : 'nav-prev';

  return (
    <article 
      ref={containerRef}
      className={`relative max-w-4xl mx-auto p-4 md:p-8 focus:outline-none ${animationClass}`} 
      tabIndex={0}
    >
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all">
          <span className="ml-2 text-xl">→</span> חזרה לתפריט
        </button>
        <div className="flex gap-2">
           <button onClick={onPrev} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md">❮</button>
           <button onClick={onNext} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md">❯</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <header 
          className={`relative h-64 md:h-80 ${sense.color} flex items-center justify-center overflow-hidden cursor-pointer`}
          onClick={() => speak(`חוש ה${sense.name}. האיבר הוא ה${sense.organ}. ${sense.description}`)}
          title="לחץ להקראה"
        >
          <img src={sense.imageUrl} alt="" className={`absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay transition-opacity duration-1000 ${headerLoaded ? 'opacity-30' : 'opacity-0'}`} onLoad={() => setHeaderLoaded(true)} />
          <div className="relative text-center text-white z-10 px-4">
            <div className="text-7xl mb-4 drop-shadow-lg animate-bounce">{sense.icon}</div>
            <h1 id="detail-title" className="text-5xl md:text-7xl font-black drop-shadow-xl">חוש ה{sense.name}</h1>
            <p className="mt-4 text-2xl font-bold">האיבר: {sense.organ}</p>
          </div>
        </header>

        <div className="p-8 md:p-14">
          <section className="mb-14 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white border-r-8 border-blue-600 pr-4">מה זה בעצם?</h2>
              <button onClick={() => speak(sense.description)} className="text-2xl opacity-50 hover:opacity-100 transition-opacity" title="הקרא פסקה">🔊</button>
            </div>
            <p className="text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{sense.description}</p>
          </section>

          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-10 text-gray-800 dark:text-white border-r-8 border-blue-600 pr-4">דוגמאות מהחיים</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {sense.examples.map((example, idx) => (
                <ExampleItem key={idx} example={example} delay={idx * 150} onSpeak={() => speak(`${example.title}. ${example.description}`)} />
              ))}
            </div>
          </section>

          {relatedPrintable && (
            <section className="mb-16 bg-blue-50 dark:bg-blue-900/20 p-8 md:p-12 rounded-[3rem] border-2 border-blue-100 dark:border-blue-800/50 flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 text-center md:text-right">
                  <h2 className="text-4xl font-black text-blue-900 dark:text-blue-200 mb-4">בואו נצבע ונלמד!</h2>
                  <p className="text-xl text-blue-800/70 dark:text-blue-300/70 mb-10 leading-relaxed">הכנו דף {relatedPrintable.type} מיוחד לחוש ה{sense.name}.</p>
                  <button onClick={() => setPreviewItem(relatedPrintable)} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-3xl shadow-xl transition-all active:scale-95 text-xl"><span>🔍</span> תצוגה מקדימה והדפסה</button>
               </div>
               <div className="w-full md:w-64 h-72 relative group cursor-pointer" onClick={() => setPreviewItem(relatedPrintable)}>
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-2"><img src={relatedPrintable.imageUrl} alt="" className="w-full h-full object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all" /></div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl shadow-lg animate-bounce">🖨️</div>
               </div>
            </section>
          )}

          <nav className="border-t-2 border-gray-100 dark:border-gray-700 pt-14 flex flex-col md:flex-row items-center justify-between gap-8">
             <button onClick={onPrev} className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-gray-100 dark:bg-gray-700 rounded-3xl font-bold text-xl">❮ חוש קודם</button>
             <button onClick={onNext} className={`w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 ${sense.color} text-white rounded-3xl font-black shadow-xl hover:scale-105 transition-all text-xl`}>עבור לחוש הבא ❯</button>
          </nav>
        </div>
      </div>

      {/* MODAL PREVIEW - Fixed Rendering */}
      {previewItem && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setPreviewItem(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] w-full max-w-5xl h-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="md:w-3/5 h-[45vh] md:h-auto relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-6 md:p-16">
               <div className="bg-white rounded p-4 md:p-10 shadow-2xl w-full h-full max-w-md flex items-center justify-center border border-gray-100 relative">
                  <img src={previewItem.imageUrl} alt={previewItem.title} className="max-w-full max-h-full object-contain" />
               </div>
            </div>
            <div className="md:w-2/5 p-10 md:p-14 flex flex-col justify-center text-right">
               <span className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-black mb-4 uppercase">{previewItem.type}</span>
               <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-6 leading-tight">{previewItem.title}</h2>
               <p className="text-2xl text-gray-600 dark:text-gray-400 mb-10">ככה ייראה הדף המודפס שלכם. מוכנים?</p>
               <div className="flex flex-col gap-6">
                 <button onClick={() => handlePrint(previewItem.imageUrl, previewItem.title)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 text-2xl">🖨️ הדפס עכשיו</button>
                 <button onClick={() => setPreviewItem(null)} className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold py-4 rounded-3xl transition-all text-lg">סגור תצוגה</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

const ExampleItem: React.FC<{ example: Example; delay: number; onSpeak: () => void }> = ({ example, delay, onSpeak }) => {
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
          className="flex overflow-x-auto snap-inline no-scrollbar h-full scroll-smooth"
        >
          {example.imageUrls.map((url, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
               <img src={url} alt={`${example.title} - ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        {example.imageUrls.length > 1 && (
          <>
            <button onClick={() => scrollTo(Math.max(0, currentIndex - 1))} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow ${currentIndex === 0 ? 'invisible' : 'visible'}`}>❯</button>
            <button onClick={() => scrollTo(Math.min(example.imageUrls.length - 1, currentIndex + 1))} className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow ${currentIndex === example.imageUrls.length - 1 ? 'invisible' : 'visible'}`}>❮</button>
          </>
        )}
      </div>
      <div className="p-8 relative">
        <button onClick={onSpeak} className="absolute top-8 left-8 text-xl opacity-20 hover:opacity-100 transition-opacity">🔊</button>
        <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">{example.title}</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{example.description}</p>
      </div>
    </div>
  );
}

export default SenseDetail;
