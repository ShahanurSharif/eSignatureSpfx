import * as React from "react";
import { useDrag } from "react-dnd";
import {
  IControlPaletteProps,
  IRecipient,
  Type,
  userColors,
} from "../common/Types";
import "./ControlPalette.scss";

const ControlPalette: React.FC<IControlPaletteProps> = ({ recipient }) => {
  const controls: Type[] = ["SIGNATURE", "INITIAL", "DATE"];
  const color = userColors[recipient.orderId] || {
    border: "#888",
    background: "#f0f0f0",
  };

  console.log(`🎨 ControlPalette rendered for recipient:`, recipient);

  return (
    <div className="control-container" style={{ padding: 10 }}>
      <h4 style={{ color: color.border }}>Controls for {recipient.name}</h4>
      {controls.map((type) => (
        <DraggableItem key={type} type={type} recipient={recipient} />
      ))}
    </div>
  );
};

const DraggableItem = ({
  type,
  recipient,
}: {
  type: Type;
  recipient: IRecipient;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CONTROL",
    item: () => {
      console.log(`🚀 Drag BEGIN: ${type} for ${recipient.name}`);
      return { type, recipient };
    },
    collect: (monitor) => {
      const dragging = monitor.isDragging();
      console.log(`🎯 Monitor collect: ${type} isDragging=${dragging}`);
      return {
        isDragging: dragging,
      };
    },
    canDrag: () => {
      console.log(`🤔 Can drag check: ${type} for ${recipient.name}`);
      return true;
    },
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      console.log(`🏁 Drag END: ${type} for ${recipient.name}, didDrop: ${didDrop}`);
      if (!didDrop) {
        console.log(`❌ Drag cancelled - no drop target found`);
      }
    },
  });

  console.log(`🎯 DraggableItem created: ${type} for ${recipient.name}, isDragging: ${isDragging}`);
  console.log(`📍 Drag connector:`, typeof drag);

  const color = userColors[recipient.orderId] || {
    border: "#888",
    background: "#f0f0f0",
  };

  const style = {
    padding: "8px 12px",
    margin: "8px 0",
    backgroundColor: color.background,
    border: `2px solid ${color.border}`,
    opacity: isDragging ? 0.5 : 1,
    borderRadius: 6,
    color: color.border,
    fontWeight: "bold",
    textAlign: "center",
    cursor: isDragging ? "grabbing" : "grab",
    height: "20px",
    width: "150px",
    userSelect: "none",
    touchAction: "manipulation",  // Allow some touch actions but prevent panning/zooming
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
  } as const;

  return (
    <div 
      ref={drag} 
      style={style}
      onDragStart={() => console.log(`🎯 Native drag start: ${type} for ${recipient.name}`)}
    >
      {type}
    </div>
  );
};

export default ControlPalette;
