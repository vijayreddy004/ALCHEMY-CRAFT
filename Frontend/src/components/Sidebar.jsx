import React, { useState } from 'react';
import Element from './Element';
import { Scroll, BookOpen } from 'lucide-react';
import { useDrop } from 'react-dnd';

const Sidebar = ({ elements }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [, drop] = useDrop(() => ({
    accept: 'canvas-element',
    drop: () => {
      return { removeFromCanvas: true };
    },
  }));

  return (
    <div 
      ref={drop}
      className="bg-[#2c1810]/10 p-4 rounded-lg border-2 border-[#2c1810]/20 backdrop-blur-sm flex flex-col"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Scroll size={16} className="text-amber-800" />
        <h2 className="text-lg font-serif text-[#2c1810]">Known Elements</h2>
      </div>
      
      {/* Elements Grid */}
      <div className="grid grid-cols-2 gap-2 overflowX-scroll mb-4 custom-scrollbar max-h-[50vh] w-[240px]">
        {elements.map((element) => (
          <Element 
            key={element.id} 
            {...element} 
            onClick={() => setSelectedElement(element)}
            isSelected={selectedElement?.id === element.id}
          />
        ))}
      </div>

      {/* Combination History */}
      {selectedElement && (
        <div className="pt-4 border-t border-[#2c1810]/20">
          <div className="flex items-center gap-2 mb-2 text-sm text-[#2c1810]">
            <BookOpen size={14} />
            <span>Creation Path</span>
          </div>
          <div className="text-xs text-[#2c1810]/80 space-y-1">
            {selectedElement.combinationSteps?.length > 0 ? (
              selectedElement.combinationSteps.map((step, index) => (
                <div key={index} className="leading-tight">
                  {step}
                </div>
              ))
            ) : (
              <span className="italic">Primordial element</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;