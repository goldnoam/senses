
import React, { useState } from 'react';
import { PRINTABLES, PrintableResource } from '../constants';

const Printables: React.FC = () => {
  const [previewItem, setPreviewItem] = useState<PrintableResource | null>(null);

  const handlePrint = (imageUrl: string, title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html dir="rtl" lang="he">
        <head>
          <title>${title}</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Assistant', sans-serif; text-align: center; padding: 40px; background: #f9fafb; }
            .paper { background: white; padding: 30px; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 800px; width: 100%; }
            img { max-width: 100%; height: auto; border: 1px solid #eee; margin-bottom: 20px; }
            h1 { margin-top: 0; color: #1e1b4b; font-size: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px; }
            .footer { font-size: 12px; color: #9ca3af; margin-top: 20px; }
            @media print {
              body { background: white; padding: 0; }
              .paper { border: none; box-shadow: none; max-width: none; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="paper">
            <h1>${title} - חמשת החושים</h1>
            <img src="${imageUrl}" alt="${title}" />
            <div class="footer">הודפס מאתר "חמשת החושים - מסע לימודי"</div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-indigo-900 dark:text-indigo-300 mb-4">דפי עבודה וצביעה</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">הקליקו על דף כדי לראות אותו בגדול ולהדפיס</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" role="list" aria-label="רשימת דפי עבודה להדפסה">
        {PRINTABLES.map((item) => (
          <article 
            key={item.id} 
            onClick={() => setPreviewItem(item)}
            className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer" 
            role="listitem"
          >
            <div className="relative h-72 bg-gray-50 dark:bg-gray-900 overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt="" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-md uppercase">
                {item.type}
              </div>
              <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                <div className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                   <span>🔍</span> תצוגה מקדימה
                </div>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-black mb-2 text-gray-800 dark:text-white group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-sm">
                <span>🖨️</span> לחצו להדפסה
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Enhanced Modal Preview */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="bg-gray-100 dark:bg-gray-950 rounded-[2.5rem] w-full max-w-5xl h-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-300 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visual Paper Representation */}
            <div className="md:w-3/5 h-[50vh] md:h-auto relative bg-gray-200 dark:bg-gray-800 flex items-center justify-center p-6 md:p-12 overflow-hidden">
               <div className="bg-white rounded shadow-2xl p-4 md:p-8 w-full h-full max-w-md animate-in slide-in-from-bottom-12 duration-500 delay-150 relative">
                  <div className="absolute top-0 right-0 left-0 h-1 bg-indigo-600/10"></div>
                  <img 
                    src={previewItem.imageUrl} 
                    alt={previewItem.title} 
                    className="w-full h-full object-contain grayscale-0 md:grayscale group-hover:grayscale-0 transition-all" 
                  />
               </div>
               <div className="absolute bottom-4 right-4 bg-black/40 text-white px-3 py-1 rounded text-xs font-mono">PREVIEW_MODE</div>
            </div>

            {/* Content & Actions */}
            <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center text-right bg-white dark:bg-gray-900">
               <div className="mb-10">
                  <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-black mb-6 uppercase tracking-widest">{previewItem.type}</span>
                  <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-6 leading-tight">{previewItem.title}</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    מוכנים להדפיס? דף זה עוצב במיוחד כדי להיות חווייתי ומהנה. ודאו שהמדפסת שלכם מחוברת ומוכנה.
                  </p>
               </div>
               
               <div className="flex flex-col gap-4 mt-auto">
                 <button 
                   onClick={() => handlePrint(previewItem.imageUrl, previewItem.title)}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl active:scale-95 text-2xl"
                 >
                   <span aria-hidden="true">🖨️</span> שלח להדפסה עכשיו
                 </button>
                 <button 
                   onClick={() => setPreviewItem(null)}
                   className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-lg"
                 >
                   חזרה לרשימה
                 </button>
               </div>
               
               <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-sm text-gray-400">
                 <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">✔</div>
                 <p>הקובץ מוכן בפורמט מותאם להדפסה ביתית (A4)</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Printables;
