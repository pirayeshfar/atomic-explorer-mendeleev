
import React, { useState, useEffect, useMemo } from 'react';
import { ELEMENTS, CATEGORY_NAMES_FA, CATEGORY_COLORS } from './constants';
import { ElementData, ElementCategory } from './types';
import ElementCell from './components/ElementCell';
import { getElementFunFact } from './geminiService';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [loadingFact, setLoadingFact] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const gridData = useMemo(() => {
    const layout = Array(10).fill(null).map(() => Array(18).fill(null));
    ELEMENTS.forEach(el => {
      if (el.atomicNumber >= 57 && el.atomicNumber <= 71) {
        layout[8][el.atomicNumber - 57 + 2] = el; 
      } else if (el.atomicNumber >= 89 && el.atomicNumber <= 103) {
        layout[9][el.atomicNumber - 89 + 2] = el;
      } else {
        layout[el.period - 1][el.group - 1] = el;
      }
    });
    return layout;
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    const num = parseInt(val);
    if (!isNaN(num)) {
      const found = ELEMENTS.find(el => el.atomicNumber === num);
      if (found) setSelectedElement(found);
    }
  };

  const shareApp = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const printElement = () => {
    window.print();
  };

  useEffect(() => {
    if (selectedElement) {
      setLoadingFact(true);
      getElementFunFact(selectedElement.name, selectedElement.persianName).then(fact => {
        setFunFact(fact);
        setLoadingFact(false);
      });
    }
  }, [selectedElement]);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto overflow-x-hidden">
      {/* Header */}
      <header className="text-center space-y-3 no-print">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
          آزمایشگاه مجازی مندلیف
        </h1>
        <div className="flex justify-center items-center gap-3">
           <span className="h-[2px] w-8 bg-blue-500/50 rounded-full"></span>
           <p className="text-slate-300 text-lg font-medium">کاوش هوشمند در دنیای عناصر - علوم نهم</p>
           <span className="h-[2px] w-8 bg-blue-500/50 rounded-full"></span>
        </div>
      </header>

      {/* Periodic Table Area */}
      <div className="bg-slate-900/40 p-5 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-sm no-print">
        <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="periodic-grid min-w-[1100px]" dir="ltr">
            {gridData.map((row, rIdx) => (
              <React.Fragment key={`row-${rIdx}`}>
                {rIdx === 8 && <div className="col-span-18 h-8" />}
                {row.map((el, cIdx) => (
                  <ElementCell 
                    key={`cell-${rIdx}-${cIdx}`} 
                    element={el} 
                    isHighlighted={selectedElement?.atomicNumber === el?.atomicNumber}
                    onClick={setSelectedElement}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6 text-[10px] md:text-xs">
          {Object.entries(CATEGORY_NAMES_FA).map(([key, name]) => (
            <div key={key} className="flex items-center gap-2 bg-slate-800/40 px-3 py-1.5 rounded-full border border-white/5 hover:border-white/20 transition-all cursor-default">
              <div className={`w-3.5 h-3.5 rounded-full shadow-sm ${CATEGORY_COLORS[key as ElementCategory]}`}></div>
              <span className="text-slate-300 font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-slate-800/30 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center items-center space-y-6 no-print">
          <div className="text-center space-y-2">
            <h3 className="text-cyan-400 font-black text-2xl">جستجوی اتمی</h3>
            <p className="text-slate-500 text-sm">عدد اتمی را برای تحلیل هوشمند وارد کنید</p>
          </div>
          <input 
            type="number" 
            placeholder="مثلا: ۲۶" 
            value={searchTerm}
            onChange={handleSearch}
            className="w-full max-w-[160px] bg-slate-950/80 text-white border-2 border-blue-500/30 rounded-3xl py-5 focus:outline-none focus:border-blue-400 transition-all text-5xl text-center font-black shadow-inner"
          />
          <button 
            onClick={shareApp}
            className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${copySuccess ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'}`}
          >
            {copySuccess ? 'لینک کپی شد ✨' : 'اشتراک‌گذاری با معلم 🔗'}
          </button>
        </div>

        <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl min-h-[400px] flex items-center justify-center relative overflow-hidden print-content">
          {selectedElement ? (
            <div className="w-full flex flex-col gap-8 animate-in fade-in zoom-in duration-500">
              <div className="flex flex-col md:flex-row gap-10">
                <div className={`flex-shrink-0 w-48 h-48 rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl ${CATEGORY_COLORS[selectedElement.category]} p-8 border-8 border-white/10 relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="absolute top-4 left-5 text-white/40 text-2xl font-black">{selectedElement.atomicNumber}</span>
                  <span className="text-7xl font-black text-white drop-shadow-xl">{selectedElement.symbol}</span>
                  <span className="text-xl font-bold text-white/90 mt-2">{selectedElement.persianName}</span>
                </div>

                <div className="flex-grow flex flex-col justify-between space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h2 className="text-4xl font-black text-white">{selectedElement.persianName}</h2>
                      <p className="text-slate-400 text-lg italic">{selectedElement.name}</p>
                    </div>
                    <button onClick={printElement} className="no-print bg-white/5 hover:bg-white/10 text-slate-300 p-3 rounded-2xl transition-all border border-white/10">
                      🖨️ چاپ شناسنامه
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                      <span className="text-blue-400 text-xs font-bold block mb-1">دسته</span>
                      <span className="text-white text-lg">{CATEGORY_NAMES_FA[selectedElement.category]}</span>
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                      <span className="text-purple-400 text-xs font-bold block mb-1">جرم اتمی</span>
                      <span className="text-white text-lg font-mono">{selectedElement.atomicMass} u</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-5 rounded-2xl border-r-8 border-blue-500 shadow-lg">
                    <span className="text-blue-500 text-xs font-black block mb-2 uppercase tracking-tighter">آرایش الکترونی ترازها</span>
                    <p className="text-3xl font-mono text-white tracking-widest leading-none" dir="ltr">{selectedElement.electronConfig}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent p-6 rounded-[1.5rem] border border-blue-500/20 relative">
                <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">دانستنی هوشمند</div>
                {loadingFact ? (
                  <div className="flex gap-2 items-center py-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                ) : (
                  <p className="text-slate-100 text-lg leading-relaxed pt-2">"{funFact}"</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 opacity-20">
              <span className="text-[120px] block animate-pulse">⚛️</span>
              <p className="text-3xl font-light">آماده برای رمزگشایی از ذرات هستی...</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-auto pt-10 border-t border-white/5 pb-8 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/20 border-2 border-white/20 z-10">🧬</div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20 border-2 border-white/20">🧪</div>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">ایده‌پردازان و طراحان:</p>
              <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                رزا و رزیتا پیرایش‌فر
              </h4>
              <div className="flex items-center gap-2">
                <span className="bg-pink-500/10 text-pink-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-500/20">پایه نهم</span>
                <span className="text-slate-600 text-[10px]">مدرسه عفاف</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] px-10 py-5 rounded-[2rem] border border-white/10 text-center space-y-1 backdrop-blur-md">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">با سپاس بیکران از:</p>
            <h4 className="text-xl font-black text-white">سرکار خانم احمدزاده</h4>
            <p className="text-blue-400/70 text-xs">دبیر محترم و راهنمای علمی پروژه</p>
          </div>

          <div className="text-right space-y-1">
            <div className="text-slate-700 text-[10px] font-bold uppercase tracking-widest leading-none">Powered by Pirayeshfar</div>
            <div className="text-slate-600 text-[9px]">تمامی حقوق برای یادگیری بهتر علوم محفوظ است © ۱۴۰۳</div>
          </div>
        </div>
      </footer>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-content { 
            border: none !important; 
            background: white !important; 
            color: black !important; 
            width: 100% !important; 
            position: absolute; 
            top: 0; left: 0; 
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
