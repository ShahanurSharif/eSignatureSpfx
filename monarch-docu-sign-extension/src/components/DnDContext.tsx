import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend } from "react-dnd-multi-backend";

// MultiBackend options with HTML5 first, then mouse/touch fallback
const backendOptions = {
  backends: [
    {
      backend: HTML5Backend,
      transition: undefined as any, // HTML5 will be tried first
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true, enableTouchEvents: true },
      preview: true,
      transition: undefined as any,
    }
  ]
};

const DnDContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("✅ DnD context loaded with MultiBackend (HTML5 + Mouse/Touch fallback)");
  
  // Debug backend capabilities
  React.useEffect(() => {
    console.log("🔍 Checking MultiBackend capabilities...");
    const supportsTouch = 'ontouchstart' in window;
    const supportsPointer = 'onpointerdown' in window;
    const supportsDrag = 'ondragstart' in document.createElement('div');
    const userAgent = navigator.userAgent;
    
    console.log(`Touch support: ${supportsTouch}`);
    console.log(`Pointer support: ${supportsPointer}`);
    console.log(`Drag support: ${supportsDrag}`);
    console.log(`User Agent: ${userAgent}`);
    console.log(`Is SharePoint Frame: ${window.parent !== window}`);
    console.log(`📱 Using MultiBackend with mouse/touch fallback for SharePoint compatibility`);
  }, []);
  
  return <DndProvider backend={MultiBackend} options={backendOptions}>{children}</DndProvider>;
};

export default DnDContext;
