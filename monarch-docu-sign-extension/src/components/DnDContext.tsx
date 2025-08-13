import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';

// NOTE: FluentUI Panel renders its content through a React Portal (Layer) directly under document.body.
// That means the physical DOM elements for drag sources & drop targets are NOT descendants of the div
// where <DnDProvider> is mounted. HTML5Backend by default only monitors events that bubble within the
// provider's DOM subtree. Consequently, dragstart never fires for portal children (our palette items),
// so useDrag's item() callback + isDragging state never activate.
// Fix: Explicitly set 'rootElement' to document.body so the backend attaches its event listeners at a
// common ancestor that DOES contain the portalled nodes.

const DnDContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const rootElement = typeof document !== "undefined" ? document.body : undefined;
  const initializedFlag = (window as any).__DND_PROVIDER_INIT__;
  if (initializedFlag) {
    console.warn('⚠️ DnDContext: Another DnDProvider already initialized');
  } else {
    (window as any).__DND_PROVIDER_INIT__ = true;
  }
  console.log(rootElement
    ? '✅ DnD context initializing (HTML5Backend rootElement=document.body)'
    : '⚠️ DnD context initializing (HTML5Backend) without document.body');
  return <DndProvider backend={HTML5Backend} options={rootElement ? { rootElement } : undefined}>{children}</DndProvider>;
};

export default DnDContext;
