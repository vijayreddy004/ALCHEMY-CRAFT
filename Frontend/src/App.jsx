import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Trash2, Sparkles, BookOpen } from 'lucide-react';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import elementslist from './Elementlist';

const initialElements = [...elementslist];

function App() {
  const [elements, setElements] = useState(initialElements);
  const [canvasElements, setCanvasElements] = useState([]);
  const [discoveries, setDiscoveries] = useState(5);

  useEffect(() => {
    console.log("Updated canvasElements in App.jsx:", canvasElements);
  }, [canvasElements]);

  // Remove element from canvas when dropped to sidebar
  useEffect(() => {
    const handleRemoveFromCanvas = (event) => {
      const { id } = event.detail;
      setCanvasElements(prev => prev.filter(el => el.id !== id));
    };

    window.addEventListener('removeFromCanvas', handleRemoveFromCanvas);
    return () => {
      window.removeEventListener('removeFromCanvas', handleRemoveFromCanvas);
    };
  }, []);

  const handleClearCanvas = () => {
    setCanvasElements([]);
  };

  const handleElementCombine = async (element1, element2) => {
    try {
      const response = await fetch(
        `https://alchemy-backend-3w5b.onrender.com/mix?first=${element1.name}&second=${element2.name}`
      );
      const data = await response.json();
      const combinedText = data.response.trim();
      const [emoji, ...nameParts] = combinedText.split(" ");
      const name = nameParts.join(" ").trim();

      // Create combination history
      const sortedNames = [element1.name, element2.name].sort();
      const newStep = `${sortedNames[0]} + ${sortedNames[1]} = ${name}`;
      const newCombinationSteps = [
        ...(element1.combinationSteps || []),
        ...(element2.combinationSteps || []),
        newStep
      ];

      const newElementId = `${element1.id}-${element2.id}`;

      // Remove parent elements from canvas
      const updatedCanvasElements = canvasElements.filter(
        el => el.id !== element1.id && el.id !== element2.id
      );

      const newElement = {
        id: newElementId,
        name,
        emoji,
        color: 'from-amber-500 to-yellow-700',
        combinationSteps: newCombinationSteps,
        x: (element1.x + element2.x) / 2,
        y: (element1.y + element2.y) / 2,
      };

      setCanvasElements([...updatedCanvasElements, newElement]);

      // Update discovered elements
      setElements(prev => {
        const exists = prev.some(el => 
          el.name.toLowerCase() === name.toLowerCase() && 
          el.emoji === emoji
        );
        
        if (!exists) {
          setDiscoveries(d => d + 1);
          return [...prev, { 
            ...newElement,
            // Maintain original color if rediscovered
            color: prev.find(el => el.name === name)?.color || newElement.color
          }];
        }
        return prev;
      });

    } catch (error) {
      console.error("Error combining elements:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#f5e6d3] relative overflow-hidden"
           style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=2000&q=80')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
           }}>
        <div className="absolute inset-0 bg-[#f5e6d3]/90"></div>
        
        <div className="container mx-auto p-4 relative">
          <header className="mb-6 text-center">
            <h1 className="text-5xl font-serif mb-2 text-[#2c1810]"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
              Alchemist's Grimoire
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-[#5c4030]">
              <BookOpen size={16} className="text-amber-800" />
              <span>{discoveries} Elements Discovered</span>
            </div>
          </header>
          
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-[#5c4030] italic font-serif">
                  "Combine elements to unlock ancient secrets..."
                </div>
                <button onClick={handleClearCanvas}
                        className="flex items-center gap-1 px-3 py-1 bg-red-900/20 hover:bg-red-900/30 rounded-lg text-sm transition-colors duration-200 text-[#3c1810]">
                  <Trash2 size={14} />
                  Clear Parchment
                </button>
              </div>
              <Canvas
                canvasElements={canvasElements}
                setCanvasElements={setCanvasElements}
                onElementCombine={handleElementCombine}
              />
            </div>
            <Sidebar elements={elements} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;