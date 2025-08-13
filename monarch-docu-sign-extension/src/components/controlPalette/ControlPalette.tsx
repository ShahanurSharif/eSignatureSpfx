import * as React from "react";
// import { useDrag, useDrop } from "react-dnd";
import { useSimpleDrag } from "../simpleDrag/SimpleDragProvider";
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
      <TestDropZone />
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
  const { startDrag } = useSimpleDrag();
  const isDragging = false; // simple drag doesn't track per-item visual yet

  console.log(`🎯 DraggableItem created: ${type} for ${recipient.name}, isDragging: ${isDragging}`);

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
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
  } as const;
  // Attach a ref wrapper so we can log native drag events (helps diagnose backend root issues)
  return <div
    style={style}
    onMouseDown={(e) => {
      e.preventDefault();
      startDrag({ type, recipient, originX: e.clientX, originY: e.clientY });
      console.log(`🛫 SIMPLE DRAG start for ${type}`);
    }}
  >{type}</div>;
};

export default ControlPalette;

// --- Inline diagnostic drop zone to isolate issues (not part of final UI) ---
const TestDropZone: React.FC = () => null; // disabled in simple drag mode
