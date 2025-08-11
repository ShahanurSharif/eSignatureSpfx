import * as React from "react";
import { IDroppedItemProps, userColors } from "../common/Types";
import { useDrag } from "react-dnd";

const DroppedItem: React.FC<IDroppedItemProps> = ({
  id,
  recipient,
  type,
  x,
  y,
  onDelete,
}) => {
  const color = userColors[recipient.orderId] || {
    border: "#555",
    background: "#eee",
  };
  const [{ isDragging }, dragRef] = useDrag({
    type: "DROPPED_CONTROL",
    item: { id, type, recipient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    padding: "4px 8px",
    backgroundColor: color.background,
    border: `2px solid ${color.border}`,
    color: color.border,
    opacity: isDragging ? 0.5 : 1,
    borderRadius: 6,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "20px",
    width: "150px",
    cursor: "move",
  };

  const closeStyle: React.CSSProperties = {
    marginLeft: 8,
    color: "#888",
    cursor: "pointer",
    fontWeight: "normal",
  };

  return (
    <div ref={dragRef} style={containerStyle}>
      {type}
      <span style={closeStyle} onClick={() => onDelete(id)}>
        ✖
      </span>
    </div>
  );
};

export default DroppedItem;
