
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
              text-align: center; 
              background: white; 
            }
            .page {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              border: 1px solid #eee;
              position: relative;
            }
            .header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 30px;
              font-size: 14px;
            }
            .title-area {
              margin-bottom: 40px;
            }
            h1 { 
              margin: 0; 
              color: #000; 
              font-size: 28px; 
              font-weight: 700;
            }
            .main-image { 
              max-width: 100%; 
              max-height: 180mm;
              height: auto; 
              margin: auto;
              display: block;
            }
            .footer { 
              margin-top: auto;
              font-size: 12px; 
              color: #777; 
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            @media print {
              body { background: white; }
              .page { border: none; width: auto; height: auto; padding: 10mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <span>שם: _________________</span>
              <span>תאריך: _________________</span>
            </div>
            <div class="title-area">
              <h1>${title}</h1>
              <p>לימוד חווייתי - חמשת החושים</p>
            </div>
            <img src="${imageUrl}" alt="${title}" class="main-image" />
            <div class="footer">
              נוצר עבור אתר "חמשת החושים" | © Noam Gold AI 2026
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
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-indigo-900 dark:text-indigo-300 mb-4">דפי עבודה וצביעה</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">דפי צביעה מקצועיים ואיורי קו המותאמים להדפסה ביתית</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRINTABLES.map((item) => (
          <article 
            key={item.id} 
            onClick={() => setPreviewItem(item)}
            className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer" 
          >
            <div className="relative h-72 bg-gray-50 dark:bg-gray-900 overflow-hidden">
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-md uppercase">{item.type}</div>
              <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                <div className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                   <span>🔍</span> תצוגה מקדימה
                </div>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-black mb-2 text-gray-800 dark:text-white group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-sm"><span>🖨️</span> לחצו להדפסה</div>
            </div>
          </article>
        ))}
      </div>

      {/* FIXED PORTAL PREVIEW */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] w-full max-w-5xl h-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-zoom-in border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-3/5 h-[45vh] md:h-auto relative bg-gray-200 dark:bg-gray-800 flex items-center justify-center p-6 md:p-12">
               <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8 w-full h-full max-w-md relative border border-gray-100 flex flex-col">
                  {/* Decorative Worksheet Header */}
                  <div className="flex justify-between text-[10px] border-b pb-2 mb-4 text-gray-400">
                    <span>שם: __________</span>
                    <span>תאריך: __________</span>
                  </div>
                  <img src={previewItem.imageUrl} alt={previewItem.title} className="w-full h-full object-contain" />
               </div>
            </div>

            <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center text-right bg-white dark:bg-gray-950">
               <div className="mb-10">
                  <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-black mb-6 uppercase tracking-widest">{previewItem.type}</span>
                  <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-6 leading-tight">{previewItem.title}</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">מוכנים להדפיס? דף העבודה כולל מקום לשם ותאריך, ומותאם בדיוק למדפסת שלכם.</p>
               </div>
               
               <div className="flex flex-col gap-4 mt-auto">
                 <button 
                   onClick={() => handlePrint(previewItem.imageUrl, previewItem.title)}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 text-2xl"
                 >
                   <span>🖨️</span> שלח להדפסה
                 </button>
                 <button 
                   onClick={() => setPreviewItem(null)}
                   className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all text-lg"
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
