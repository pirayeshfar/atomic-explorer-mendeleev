
import React, { useState, useEffect, useMemo } from 'react';
import { ELEMENTS, CATEGORY_COLORS } from './constants';
import { ElementData } from './types';
import ElementCell from './components/ElementCell';
import { getElementFunFact } from './geminiService';

const App: React.FC = () => {
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

  const fetchFact = async (element: ElementData) => {
    setLoadingFact(true);
    setFunFact(null);
    try {
      const fact = await getElementFunFact(element.name, element.persianName);
      setFunFact(fact);
    } catch (err) {
      setFunFact("اتم‌ها در حال استراحت هستند! لحظاتی دیگر دوباره کلیک کنید.");
    } finally {
      setLoadingFact(false);
    }
  };

  useEffect(() => {
    if (selectedElement) {
      fetchFact(selectedElement);
    }
  }, [selectedElement]);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-10 space-y-8 max-w-[1440px] mx-auto overflow-x-hidden text-right" dir="rtl">
      {/* هدر درخشان */}
      <header className="text-center space-y-4 no-print animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] py-2">
          آزمایشگاه مجازی مندلیف
        </h1>
        <div className="inline-block px-6 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <p className="text-blue-300 text-sm md:text-lg font-bold tracking-widest">مدرسه هوشمند عفاف - پروژه علوم تجربی</p>
        </div>
      </header>

      {/* جدول تناوبی با استایل شیشه‌ای پریمیوم */}
      <div className="bg-slate-900/40 p-6 rounded-[3rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl no-print relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50 pointer-events-none"></div>
        <div className="overflow-x-auto pb-6 scrollbar-thin relative z-10">
          <div className="periodic-grid min-w-[1000px]" dir="ltr">
            {gridData.map((row, rIdx) => (
              <React.Fragment key={`row-${rIdx}`}>
                {rIdx === 8 && <div className="col-span-18 h-10" />}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* جستجوی اتمی شیک */}
        <div className="lg:col-span-3 bg-slate-800/20 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-center items-center space-y-4 no-print transition-all hover:border-blue-500/30">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <input 
              type="number" 
              placeholder="0" 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                const el = ELEMENTS.find(x => x.atomicNumber === val);
                if (el) setSelectedElement(el);
              }}
              className="relative w-28 bg-slate-950/90 text-white border border-white/10 rounded-3xl py-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-5xl text-center font-black"
            />
          </div>
          <p className="text-slate-400 text-sm font-black uppercase tracking-tighter">جستجوی عدد اتمی</p>
        </div>

        {/* پنل اطلاعات متمرکز بر زیبایی */}
        <div className="lg:col-span-9 bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl min-h-[400px] flex items-center justify-center relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          {selectedElement ? (
            <div className="w-full flex flex-col gap-10 animate-in fade-in zoom-in duration-500 relative z-10">
              <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                <div className={`w-52 h-52 rounded-[3rem] flex flex-col items-center justify-center shadow-2xl ${CATEGORY_COLORS[selectedElement.category]} p-6 border-[6px] border-white/20 transform hover:scale-105 transition-all duration-500 cursor-default ring-8 ring-black/20`}>
                  <span className="text-7xl font-black text-white drop-shadow-lg">{selectedElement.symbol}</span>
                  <span className="text-xl font-bold text-white/90 mt-2">{selectedElement.persianName}</span>
                </div>
                <div className="flex-grow space-y-8 text-center md:text-right">
                  <div>
                    <h2 className="text-6xl font-black text-white mb-2 tracking-tight">{selectedElement.persianName}</h2>
                    <p className="text-blue-400 font-bold text-2xl opacity-80 italic">{selectedElement.name}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    <div className="bg-slate-950/40 p-5 rounded-[1.5rem] border border-white/5 backdrop-blur-sm">
                      <span className="text-slate-500 text-xs font-bold block mb-2">عدد اتمی</span>
                      <span className="text-white text-3xl font-black">{selectedElement.atomicNumber}</span>
                    </div>
                    <div className="bg-slate-950/40 p-5 rounded-[1.5rem] border border-white/5 backdrop-blur-sm">
                      <span className="text-slate-500 text-xs font-bold block mb-2">جرم اتمی</span>
                      <span className="text-white text-2xl font-bold">{selectedElement.atomicMass} <span className="text-xs opacity-50">u</span></span>
                    </div>
                    <div className="bg-slate-950/40 p-5 rounded-[1.5rem] border border-white/5 backdrop-blur-sm col-span-2 md:col-span-1">
                      <span className="text-slate-500 text-xs font-bold block mb-2">آرایش الکترونی</span>
                      <span className="text-cyan-400 text-sm font-mono dir-ltr block">{selectedElement.electronConfig}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* دانستنی هوشمند - طراحی شیک و مینیمال */}
              <div className="bg-gradient-to-r from-blue-600/20 via-blue-600/5 to-transparent p-8 rounded-[2rem] border-r-8 border-blue-500 shadow-inner min-h-[100px] flex items-center transition-all">
                {loadingFact ? (
                  <div className="flex gap-3 items-center mx-auto md:mx-0">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <span className="text-slate-400 text-sm font-medium">هوش مصنوعی در حال تحلیل اتمی...</span>
                  </div>
                ) : (
                  <p className="text-white text-xl md:text-2xl leading-relaxed font-medium">
                    <span className="text-blue-400 ml-2">✦</span>
                    {funFact || "برای دریافت اطلاعات هوشمند، یکی از عناصر را از جدول انتخاب کنید."}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <div className="text-[120px] leading-none animate-pulse">⚛️</div>
              <p className="text-3xl font-black tracking-widest uppercase">انتخاب عنصر</p>
            </div>
          )}
        </div>
      </div>

      {/* فوتر با استایل نسخه اول - بسیار شیک */}
      <footer className="mt-auto pt-12 border-t border-white/5 pb-10 no-print">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="space-y-2 group">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1 opacity-60">توسعه و طراحی هوشمند:</p>
            <h4 className="text-4xl md:text-5xl font-black bg-gradient-to-l from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent transition-all duration-500 group-hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]">
              رزا و رزیتا پیرایش‌فر
            </h4>
            <div className="h-1.5 w-0 group-hover:w-full bg-gradient-to-l from-pink-500 to-indigo-500 transition-all duration-1000 rounded-full"></div>
          </div>
          
          <div className="bg-white/[0.03] px-10 py-5 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-xl hover:bg-white/[0.05] transition-colors">
            <div className="flex flex-col items-center md:items-end gap-1">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">تحت نظارت علمی:</span>
              <span className="text-2xl font-black text-blue-400 tracking-tight">سرکار خانم احمدزاده</span>
              <span className="text-slate-600 text-[10px]">دبیر علوم تجربی - پایه نهم</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
