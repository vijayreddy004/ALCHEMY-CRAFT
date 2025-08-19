import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import Element from './Element';

const Canvas = ({ canvasElements, setCanvasElements, onElementCombine }) => {
  const canvasRef = useRef(null);

  console.log("Canvas elements in Canvas.jsx as props:", canvasElements);

//   setCanvasElements(prev => {
//     const updatedCanvasElements = [...prev, newItem];
  
//     // Now check for nearby elements using 'prev' (which is up-to-date)
//     const nearbyElement = prev.find(el => {
//       const distance = Math.hypot(el.x - x, el.y - y);
//       console.log(`Distance from ${el.id}-${el.index} to new element:`, distance);
//       return distance < 40;
//     });
  
//     if (nearbyElement) {
//       console.log("Found nearby element for combination:", { dropped: newItem, nearby: nearbyElement });
//       onElementCombine(nearbyElement, newItem);
//       return prev; // Don't add a duplicate if combination happens
//     }
  
//     console.log("No nearby element found. Adding new element to canvas:", newItem);
//     return updatedCanvasElements;
//   });
  

const [, drop] = useDrop(() => ({
    accept: ['element', 'canvas-element'],
    drop: (item, monitor) => {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const dropOffset = monitor.getClientOffset();
      const x = dropOffset.x - canvasRect.left;
      const y = dropOffset.y - canvasRect.top;
      
      console.log("Drop event triggered. Item:", item);
      console.log("Drop coordinates:", { x, y });
  
      setCanvasElements(prev => {
        console.log("Current canvasElements (before update):", prev);
  
        const findNearbyElement = (elements, x, y, excludeId = null, excludeIndex = null) => {
          return elements.find(el => {
            if (el.id === excludeId && el.index === excludeIndex) return false;
            const distance = Math.hypot(el.x - x, el.y - y);
            console.log(`Distance from ${el.id}-${el.index} to dropped element:`, distance);
            return distance < 60;
          });
        };
  
        if (item.isCanvasElement) {
          // Moving an element on the canvas
          const nearbyElement = findNearbyElement(prev, x, y, item.id, item.index);
          
          if (nearbyElement) {
            console.log("Moving element dropped near another for combination:", { moving: item, nearby: nearbyElement });
            onElementCombine(nearbyElement, { ...item, x, y });
            return prev; // No need to update position if combination occurs
          }
  
          console.log("No nearby element found for moving canvas element. Updating position:", { item, newPos: { x, y } });
          return prev.map(el => (el.id === item.id && el.index === item.index) ? { ...el, x, y } : el);
        }
  
        // New element from the sidebar
        console.log("New element drop from sidebar:", item);
        const newItem = { ...item, x, y, index: Date.now() };
  
        const nearbyElement = findNearbyElement(prev, x, y);
  
        if (nearbyElement) {
          console.log("Found nearby element for combination:", { dropped: newItem, nearby: nearbyElement });
          onElementCombine(nearbyElement, newItem);
          return prev; // Do not add a new element if a combination occurs
        }
  
        console.log("No nearby element found for combination. Adding new element to canvas:", newItem);
        return [...prev, newItem];
      });
    },
  }));
  

  return (
    <div
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      className="w-full h-[80vh] bg-[#f5e6d3] rounded-lg relative overflow-hidden shadow-inner"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[#f5e6d3]/80 pointer-events-none"></div>
      {canvasElements.map((element, index) => (
        <Element
          key={`${element.id}-${index}`}
          {...element}
          index={element.index || index}
          isCanvasElement={true}
          style={{
            position: 'absolute',
            left: element.x - 15,
            top: element.y - 15,
            zIndex: 10
          }}
        />
      ))}
    </div>
  );
};

export default Canvas;
