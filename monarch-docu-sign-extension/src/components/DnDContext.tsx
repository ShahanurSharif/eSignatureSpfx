import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DnDContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("✅ DnD context loaded");
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
};

export default DnDContext;
