
import React, { useState, useMemo } from 'react';
import { ELEMENTS, CATEGORY_COLORS, CATEGORY_NAMES_FA } from './constants';
import { ElementData } from './types';
import ElementCell from './components/ElementCell';

const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(ELEMENTS[1]); // پیش‌فرض هلیم مطابق تصویر

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-8 max-w-[1500px] mx-auto text-right" dir="rtl">
      
      {/* عنوان اصلی و جذاب برای جدول */}
      <div className="text-center space-y-2 no-print">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
          اطلس تعاملی ذرات بنیادین مندلیف
        </h1>
        <p className="text-slate-500 text-sm font-bold tracking-[0.2em] uppercase">Mendeleev Atomic Atlas | Smart Science Edition</p>
      </div>

      {/* جدول تناوبی (بخش فوقانی) */}
      <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-md no-print relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="periodic-grid min-w-[1000px]" dir="ltr">
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

      {/* بخش اصلی مطابق تصویر */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* پنل اطلاعات (سمت چپ در تصویر) */}
        <div className="lg:col-span-8 bg-[#0b1426] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative min-h-[500px]">
          {selectedElement ? (
            <div className="space-y-6">
              {/* هدر اطلاعات */}
              <div className="flex justify-between items-start">
                <button 
                  onClick={handlePrint}
                  className="no-print bg-slate-800/50 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 text-sm transition-all"
                >
                  <span>🖨️ چاپ شناسنامه</span>
                </button>
                
                <div className="flex items-center gap-6">
                  <div className="text-left md:text-right">
                    <h2 className="text-5xl font-black text-white">{selectedElement.persianName}</h2>
                    <p className="text-slate-500 text-xl font-medium italic">{selectedElement.name}</p>
                  </div>
                  <div className={`w-36 h-36 rounded-3xl flex flex-col items-center justify-center shadow-2xl ${CATEGORY_COLORS[selectedElement.category]} border-4 border-white/20`}>
                    <span className="absolute top-2 left-3 text-white/50 text-xl font-bold">{selectedElement.atomicNumber}</span>
                    <span className="text-6xl font-black text-white">{selectedElement.symbol}</span>
                    <span className="text-sm font-bold text-white/90 mt-1">{selectedElement.persianName}</span>
                  </div>
                </div>
              </div>

              {/* شبکه اطلاعات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#070d19] p-6 rounded-3xl border border-white/5 flex justify-between items-center">
                   <div className="text-left">
                     <span className="text-white text-2xl font-black">{selectedElement.atomicMass} <span className="text-xs text-slate-500">u</span></span>
                   </div>
                   <div className="text-right">
                     <span className="text-purple-400 text-xs font-bold block mb-1">جرم اتمی</span>
                   </div>
                </div>
                <div className="bg-[#070d19] p-6 rounded-3xl border border-white/5 flex justify-between items-center">
                   <div className="text-left">
                     <span className="text-white text-xl font-black">{CATEGORY_NAMES_FA[selectedElement.category]}</span>
                   </div>
                   <div className="text-right">
                     <span className="text-cyan-400 text-xs font-bold block mb-1">دسته</span>
                   </div>
                </div>
              </div>

              {/* آرایش الکترونی */}
              <div className="bg-[#070d19] p-8 rounded-3xl border border-white/5 relative group">
                <span className="absolute top-4 right-6 text-blue-500 text-xs font-black">آرایش الکترونی ترازها</span>
                <div className="text-left pt-2">
                  <span className="text-white text-4xl font-mono tracking-widest leading-loose dir-ltr inline-block">
                    {selectedElement.electronConfig.split(' ').map((part, i) => (
                      <span key={i} className="mr-4">
                        {part.match(/[0-9]+[a-z]/)}<sup className="text-blue-400">{part.match(/[0-9]+$/)}</sup>
                      </span>
                    ))}
                  </span>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-full"></div>
              </div>

              {/* بخش توضیحات ثابت */}
              <div className="bg-[#0f1d3a]/30 p-8 rounded-[2rem] border border-blue-500/20 relative">
                <div className="absolute -top-3 right-8 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">دانستنی هوشمند</div>
                <p className="text-slate-300 text-lg leading-relaxed text-center font-medium">
                   این عنصر از اجزای بنیادی در ساختار ماده است که در صنایع مختلف و طبیعت نقشی کلیدی ایفا می‌کند. 
                   اطلاعات دقیق ساختار اتمی، ظرفیت‌ها و خواص فیزیکی در شناسنامه اختصاصی هر عنصر قابل مشاهده است.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <span className="text-9xl mb-4">⚛️</span>
              <p className="text-2xl font-bold">عنصری را انتخاب کنید</p>
            </div>
          )}
        </div>

        {/* بخش جستجو (سمت راست در تصویر) */}
        <div className="lg:col-span-4 bg-[#0b1426] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center justify-center space-y-8 min-h-[500px]">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-cyan-400">جستجوی اتمی</h3>
            <p className="text-slate-500 text-sm">عدد اتمی را برای تحلیل هوشمند وارد کنید</p>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-xl"></div>
            <div className="relative bg-[#070d19] border-2 border-blue-500/30 rounded-[2rem] p-6 flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <button onClick={() => {
                  const current = selectedElement?.atomicNumber || 0;
                  const next = ELEMENTS.find(e => e.atomicNumber === current + 1);
                  if (next) setSelectedElement(next);
                }} className="text-slate-500 hover:text-white transition-colors">▲</button>
                <button onClick={() => {
                  const current = selectedElement?.atomicNumber || 0;
                  const prev = ELEMENTS.find(e => e.atomicNumber === current - 1);
                  if (prev) setSelectedElement(prev);
                }} className="text-slate-500 hover:text-white transition-colors">▼</button>
              </div>
              <div className="w-px h-16 bg-white/10"></div>
              <input 
                type="number"
                value={selectedElement?.atomicNumber || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const el = ELEMENTS.find(x => x.atomicNumber === val);
                  if (el) setSelectedElement(el);
                }}
                className="bg-transparent text-white text-7xl font-black w-24 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

      </div>

      {/* فوتر دقیقاً مطابق تصویر با سال جدید */}
      <footer className="mt-auto pt-16 pb-8 no-print border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* بخش طراحان (راست) */}
          <div className="flex items-center justify-end gap-4 order-1">
             <div className="text-right">
               <p className="text-slate-500 text-[10px] font-bold">ایده‌پردازان و طراحان:</p>
               <h4 className="text-3xl font-black text-white mt-1">رزا و رزیتا پیرایش‌فر</h4>
               <div className="flex items-center justify-end gap-2 mt-1">
                 <span className="bg-pink-500/20 text-pink-400 text-[10px] px-2 py-0.5 rounded-full font-bold">پایه نهم</span>
                 <span className="text-slate-600 text-[10px]">مدرسه عفاف</span>
               </div>
             </div>
             <div className="flex gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 ring-4 ring-white/5">🧪</div>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 ring-4 ring-white/5">🧬</div>
             </div>
          </div>

          {/* بخش سپاس (وسط) */}
          <div className="order-2 flex justify-center">
            <div className="bg-[#0b1426] px-8 py-4 rounded-3xl border border-white/5 text-center shadow-xl">
               <p className="text-slate-500 text-[10px] font-bold mb-1">با سپاس بیکران از:</p>
               <h5 className="text-xl font-black text-white tracking-tighter">سرکار خانم احمدزاده</h5>
               <p className="text-blue-500/80 text-[10px] font-medium">دبیر محترم و راهنمای علمی پروژه</p>
            </div>
          </div>

          {/* بخش لوگو و حقوق (چپ) - سال به 1404 تغییر کرد */}
          <div className="order-3 flex flex-col items-start space-y-1">
             <p className="text-slate-500 text-[10px] font-black tracking-widest">POWERED BY PIRAYESHFAIR</p>
             <p className="text-slate-700 text-[9px] font-bold">تمامی حقوق برای یادگیری بهتر علوم محفوظ است © ۱۴۰۴</p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default App;
