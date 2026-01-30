
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

  const printElement = () => {
    window.print();
  };

  useEffect(() => {
    if (selectedElement) {
      setLoadingFact(true);
      setFunFact(null);
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
        <p className="text-slate-400 text-lg font-medium">پروژه علمی رزا و رزیتا پیرایش‌فر - مدرسه عفاف</p>
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
            <div key={key} className="flex items-center gap-2 bg-slate-800/40 px-3 py-1.5 rounded-full border border-white/5">
              <div className={`w-3.5 h-3.5 rounded-full ${CATEGORY_COLORS[key as ElementCategory]}`}></div>
              <span className="text-slate-300 font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-slate-800/30 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center items-center space-y-6 no-print">
          <div className="text-center space-y-2">
            <h3 className="text-cyan-400 font-black text-2xl">جستجوی عنصر</h3>
            <p className="text-slate-500 text-sm">عدد اتمی مورد نظر را وارد کنید</p>
          </div>
          <input 
            type="number" 
            placeholder="مثلا: ۲۶" 
            value={searchTerm}
            onChange={handleSearch}
            className="w-full max-w-[160px] bg-slate-950/80 text-white border-2 border-blue-500/30 rounded-3xl py-4 focus:outline-none focus:border-blue-400 transition-all text-4xl text-center font-black"
          />
        </div>

        <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl min-h-[400px] flex items-center justify-center relative print-content">
          {selectedElement ? (
            <div className="w-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
              <div className="flex flex-col md:flex-row gap-8">
                <div className={`flex-shrink-0 w-44 h-44 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl ${CATEGORY_COLORS[selectedElement.category]} p-6 border-4 border-white/20`}>
                  <span className="text-white/60 text-xl font-black mb-1">{selectedElement.atomicNumber}</span>
                  <span className="text-6xl font-black text-white">{selectedElement.symbol}</span>
                  <span className="text-lg font-bold text-white/90 mt-1">{selectedElement.persianName}</span>
                </div>

                <div className="flex-grow flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h2 className="text-4xl font-black text-white">{selectedElement.persianName}</h2>
                      <p className="text-slate-400 text-lg italic">{selectedElement.name}</p>
                    </div>
                    <button onClick={printElement} className="no-print bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl transition-all border border-white/10 text-sm">
                      🖨️ چاپ شناسنامه
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-blue-400 text-[10px] font-bold block mb-1">گروه / دوره</span>
                      <span className="text-white">{selectedElement.group} / {selectedElement.period}</span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-purple-400 text-[10px] font-bold block mb-1">جرم اتمی</span>
                      <span className="text-white font-mono">{selectedElement.atomicMass}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border-r-4 border-blue-500 shadow-lg">
                    <span className="text-blue-500 text-[10px] font-black block mb-1">آرایش الکترونی</span>
                    <p className="text-2xl font-mono text-white tracking-widest" dir="ltr">{selectedElement.electronConfig}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/20">
                <span className="text-blue-400 text-xs font-black block mb-2 uppercase tracking-widest">دانستنی هوشمند (AI)</span>
                {loadingFact ? (
                  <div className="flex gap-1 py-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                ) : (
                  <p className="text-slate-200 text-lg leading-relaxed">{funFact}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 opacity-30">
              <span className="text-8xl block">🔬</span>
              <p className="text-xl">برای مشاهده جزئیات، یک عنصر را انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-auto pt-8 border-t border-white/5 pb-6 no-print text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              رزا و رزیتا پیرایش‌فر
            </h4>
            <p className="text-slate-500 text-sm">دانش‌آموزان پایه نهم - دبیرستان عفاف</p>
          </div>
          <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-xs">با راهنمایی دبیر محترم: <span className="text-white font-bold">سرکار خانم احمدزاده</span></p>
          </div>
        </div>
      </footer>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; padding: 0 !important; }
          .print-content { 
            border: 2px solid #eee !important; 
            background: white !important; 
            color: black !important; 
            width: 100% !important; 
            padding: 40px !important;
            border-radius: 0 !important;
          }
          .print-content * { color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
