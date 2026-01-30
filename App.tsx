
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
  const [needsKey, setNeedsKey] = useState(false);

  // بررسی وضعیت کلید API در هنگام لود برنامه
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setNeedsKey(!hasKey && !process.env.API_KEY);
      } else {
        setNeedsKey(!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
      // بعد از انتخاب کلید، اگر عنصری انتخاب شده بود، دوباره تلاش کن
      if (selectedElement) fetchFact(selectedElement);
    }
  };

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
      setNeedsKey(false);
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING" || err.message === "API_KEY_INVALID") {
        setNeedsKey(true);
      } else {
        setFunFact("اتم‌ها در حال استراحت هستند! لحظاتی دیگر دوباره کلیک کنید.");
      }
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
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto overflow-x-hidden">
      <header className="text-center space-y-3 no-print">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
          آزمایشگاه مجازی مندلیف
        </h1>
        <p className="text-slate-300 text-lg font-medium">پروژه علمی رزا و رزیتا پیرایش‌فر - علوم نهم</p>
      </header>

      <div className="bg-slate-900/40 p-5 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-sm no-print">
        <div className="overflow-x-auto pb-6 scrollbar-thin">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-slate-800/30 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center items-center space-y-6 no-print">
          <input 
            type="number" 
            placeholder="عدد اتمی" 
            onChange={(e) => {
              const el = ELEMENTS.find(x => x.atomicNumber === parseInt(e.target.value));
              if (el) setSelectedElement(el);
            }}
            className="w-full max-w-[160px] bg-slate-950/80 text-white border-2 border-blue-500/30 rounded-3xl py-5 focus:outline-none focus:border-blue-400 text-5xl text-center font-black"
          />
          <p className="text-slate-500 text-sm">عدد اتمی را وارد کنید</p>
        </div>

        <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl min-h-[350px] flex items-center justify-center relative">
          {selectedElement ? (
            <div className="w-full flex flex-col gap-8">
              <div className="flex flex-col md:flex-row gap-10">
                <div className={`w-48 h-48 rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl ${CATEGORY_COLORS[selectedElement.category]} p-8 border-8 border-white/10`}>
                  <span className="text-7xl font-black text-white">{selectedElement.symbol}</span>
                  <span className="text-xl font-bold text-white/90 mt-2">{selectedElement.persianName}</span>
                </div>
                <div className="flex-grow space-y-4">
                  <h2 className="text-4xl font-black text-white">{selectedElement.persianName}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-blue-400 text-xs font-bold block">عدد اتمی</span>
                      <span className="text-white text-lg">{selectedElement.atomicNumber}</span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-purple-400 text-xs font-bold block">جرم اتمی</span>
                      <span className="text-white text-lg">{selectedElement.atomicMass} u</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600/10 to-transparent p-6 rounded-2xl border border-blue-500/20 relative min-h-[100px] flex items-center justify-center">
                {needsKey ? (
                  <div className="text-center space-y-3">
                    <p className="text-amber-400 text-sm font-bold">برای مشاهده دانستنی‌های هوشمند، هوش مصنوعی را فعال کنید</p>
                    <button 
                      onClick={handleConnectKey}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95"
                    >
                      🚀 فعال‌سازی هوش مصنوعی جمینای
                    </button>
                    <p className="text-[10px] text-slate-500">
                      راهنما: پس از کلیک، در پنجره باز شده یک پروژه دارای Billing انتخاب کنید.
                    </p>
                  </div>
                ) : loadingFact ? (
                  <div className="flex gap-3 items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <span className="text-slate-400">در حال دریافت دانستنی...</span>
                  </div>
                ) : (
                  <p className="text-slate-100 text-lg leading-relaxed">
                    {funFact || "برای دیدن دانستنی، روی عنصر کلیک کنید."}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 opacity-20">
              <span className="text-[100px] block animate-pulse">⚛️</span>
              <p className="text-2xl">یک عنصر را برای شروع انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-auto pt-10 border-t border-white/5 pb-8 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-right">
          <div>
            <p className="text-slate-500 text-xs font-black">طراحان:</p>
            <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">رزا و رزیتا پیرایش‌فر</h4>
          </div>
          <div className="bg-white/[0.02] px-6 py-3 rounded-2xl border border-white/10">
            <p className="text-slate-500 text-xs font-bold italic underline decoration-blue-500/50">با راهنمایی علمی سرکار خانم احمدزاده</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
