import React from 'react';
import { useDrag } from 'react-dnd';

const Element = ({ 
  id, 
  name, 
  emoji, 
  color = 'from-amber-700 to-amber-900', 
  style,
  isCanvasElement,
  index,
  x,
  y,
  // New props added for combination history
  onClick,       // <-- Add onClick prop
  isSelected     // <-- Add isSelected prop
}) => {

const [{ isDragging }, drag] = useDrag(() => ({
  type: isCanvasElement ? 'canvas-element' : 'element',
  item: { 
    id, 
    name, 
    emoji, 
    color,
    isCanvasElement,
    index,
    x,
    y
  },
  end: (item, monitor) => {
    const dropResult = monitor.getDropResult();
    
    // Handle sidebar removal
    if (dropResult?.removeFromCanvas) {
      window.dispatchEvent(new CustomEvent('removeFromCanvas', {
        detail: { id } // Changed from index to id
      }));
    }
    // Handle position reset
    else if (!monitor.didDrop()) {
      window.dispatchEvent(new CustomEvent('resetPosition', {
        detail: { id, x, y }
      }));
    }
  },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
}), [id, index, x, y]);

  return (
    <div
      ref={drag}
      onClick={onClick}  // <-- Add onClick handler here
      className={`
        relative group flex items-center gap-1.5 px-2.5 py-1.5 m-0.1
        rounded-lg cursor-move transition-all duration-200
        bg-gradient-to-br ${color}
        hover:scale-105 hover:shadow-lg hover:shadow-amber-900/20
        ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'}
        ${isSelected ? 'ring-2 ring-black' : ''}  // <-- Add selection indicator
      `}
      style={style}
    >
      <span className="text-base relative z-10">{emoji}</span>
      <span className="text-xs font-serif font-medium relative z-10 text-white/90">{name}</span>
      <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
    </div>
  );
};

export default Element;