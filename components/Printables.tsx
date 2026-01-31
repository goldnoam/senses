
import React, { useState, useEffect } from 'react';
import { PRINTABLES, PrintableResource } from '../constants';

const Printables: React.FC = () => {
  const [previewItem, setPreviewItem] = useState<PrintableResource | null>(null);

  useEffect(() => {
    if (previewItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [previewItem]);

  const handlePrint = (imageUrl: string, title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html dir="rtl" lang="he">
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;700&display=swap');
            body { 
              margin: 0; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              min-height: 100vh; 
              font-family: 'Assistant', sans-serif; 
              background: #fff;
              color: #000;
            }
            .worksheet-container {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              border: 1px solid #ddd;
              position: relative;
            }
            .worksheet-header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 30px;
              font-size: 18px;
              font-weight: bold;
            }
            .worksheet-title {
              text-align: center;
              margin-bottom: 40px;
            }
            h1 { 
              margin: 0; 
              font-size: 32px; 
              text-decoration: underline;
            }
            .worksheet-image-wrapper {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 40px;
            }
            img { 
              max-width: 100%; 
              max-height: 180mm;
              object-fit: contain;
              filter: grayscale(100%) contrast(1.2);
            }
            .worksheet-footer {
              text-align: center;
              font-size: 12px;
              color: #555;
              border-top: 1px dashed #ccc;
              padding-top: 10px;
            }
            @media print {
              body { background: none; }
              .worksheet-container { border: none; width: auto; height: auto; padding: 10mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="worksheet-container">
            <div class="worksheet-header">
              <span>שם: _________________</span>
              <span>תאריך: _________________</span>
            </div>
            <div class="worksheet-title">
              <h1>${title}</h1>
              <p>לימוד חווייתי - מסע בחמשת החושים</p>
            </div>
            <div class="worksheet-image-wrapper">
              <img src="${imageUrl}" alt="${title}" />
            </div>
            <div class="worksheet-footer">
              נוצר עבור אתר "חמשת החושים" | (C) Noam Gold AI 2026
            </div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => { window.print(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-indigo-900 dark:text-indigo-300 mb-6">מרכז דפי העבודה</h2>
        <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">כאן תוכלו למצוא דפי צביעה, מבוכים ותרגילים המיועדים להדפסה ולימוד מהנה בבית או בכיתה.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {PRINTABLES.map((item) => (
          <article 
            key={item.id} 
            onClick={() => setPreviewItem(item)}
            className="group bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-lg border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 overflow-hidden flex flex-col hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2" 
          >
            <div className="relative h-64 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center p-6">
              <img 
                src={item.imageUrl} 
                alt="" 
                className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" 
              />
              <div className="absolute top-6 right-6 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                {item.type}
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-black mb-3 text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 flex-grow leading-relaxed line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black text-lg">
                <span className="text-2xl">🖨️</span> לחצו לתצוגה והדפסה
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* PORTAL PREVIEW */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-[3rem] w-full max-w-6xl h-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-zoom-in border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visual Worksheet Side */}
            <div className="lg:w-3/5 h-[40vh] lg:h-auto relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-6 md:p-12 overflow-auto">
               <div className="bg-white rounded-lg shadow-2xl p-6 md:p-12 w-full max-w-[210mm] aspect-[210/297] relative border border-gray-200 flex flex-col text-black">
                  <div className="flex justify-between text-[10px] md:text-sm border-b-2 border-black pb-2 mb-6 font-bold">
                    <span>שם: _________________</span>
                    <span>תאריך: _________________</span>
                  </div>
                  <div className="text-center mb-8">
                    <h4 className="text-lg md:text-2xl font-black underline mb-1">{previewItem.title}</h4>
                    <p className="text-[10px] md:text-xs text-gray-500">דף עבודה לימודי - חמשת החושים</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <img src={previewItem.imageUrl} alt={previewItem.title} className="max-w-full max-h-full object-contain filter grayscale contrast-125" />
                  </div>
                  <div className="mt-6 text-center text-[8px] md:text-[10px] text-gray-400 border-t border-dashed pt-2">
                    (C) Noam Gold AI 2026 | מיועד לשימוש חינוכי בלבד
                  </div>
               </div>
            </div>

            {/* Controls Side */}
            <div className="lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center text-right bg-white dark:bg-gray-950">
               <div className="mb-12">
                  <span className="inline-block px-5 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-black mb-8 uppercase tracking-widest">{previewItem.type}</span>
                  <h2 className="text-5xl font-black text-gray-800 dark:text-white mb-8 leading-tight">{previewItem.title}</h2>
                  <p className="text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">הדף מותאם להדפסה על דף A4 סטנדרטי. מומלץ להשתמש בצבעי עיפרון או טושים לאחר ההדפסה!</p>
               </div>
               
               <div className="flex flex-col gap-5 mt-auto">
                 <button 
                   onClick={() => handlePrint(previewItem.imageUrl, previewItem.title)}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 text-3xl"
                 >
                   <span>🖨️</span> הדפס דף עבודה
                 </button>
                 <button 
                   onClick={() => setPreviewItem(null)}
                   className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold py-5 rounded-3xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-xl"
                 >
                   סגור תצוגה
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Printables;
