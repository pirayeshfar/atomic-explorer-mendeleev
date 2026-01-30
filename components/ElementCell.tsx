
import React from 'react';
import { ElementData } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ElementCellProps {
  element: ElementData | null;
  isHighlighted: boolean;
  onClick: (element: ElementData) => void;
}

const ElementCell: React.FC<ElementCellProps> = ({ element, isHighlighted, onClick }) => {
  if (!element) return <div className="element-cell" />;

  return (
    <div
      onClick={() => onClick(element)}
      className={`
        element-cell cursor-pointer flex flex-col items-center justify-center 
        rounded-md p-1 border border-white/10 text-white shadow-lg
        ${CATEGORY_COLORS[element.category]} 
        ${isHighlighted ? 'highlight z-20 scale-110 shadow-white/50 ring-4 ring-white' : 'opacity-90'}
      `}
    >
      <span className="text-[10px] md:text-xs font-bold self-start">{element.atomicNumber}</span>
      <span className="text-sm md:text-xl font-black">{element.symbol}</span>
      <span className="text-[8px] md:text-[10px] hidden sm:block font-medium truncate w-full text-center">
        {element.persianName}
      </span>
    </div>
  );
};

export default ElementCell;
