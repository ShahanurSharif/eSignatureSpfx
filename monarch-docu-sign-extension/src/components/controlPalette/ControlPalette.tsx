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
    item: { type, recipient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const color = userColors[recipient.orderId] || {
    border: "#888",
    background: "#f0f0f0",
  };

  const style: React.CSSProperties = {
    padding: "8px 12px",
    margin: "8px 0",
    backgroundColor: color.background,
    border: `2px solid ${color.border}`,
    opacity: isDragging ? 0.5 : 1,
    borderRadius: 6,
    color: color.border,
    fontWeight: "bold",
    textAlign: "center",
    cursor: "grab",
    height: "20px",
    width: "150px",
  };

  return (
    <div ref={drag} style={style}>
      {type}
    </div>
  );
};

export default ControlPalette;
