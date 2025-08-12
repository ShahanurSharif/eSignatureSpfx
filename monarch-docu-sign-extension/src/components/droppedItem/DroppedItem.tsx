import * as React from "react";
import { IDroppedItemProps, userColors } from "../common/Types";
import { useDrag } from "react-dnd";

const DroppedItem: React.FC<IDroppedItemProps> = ({
  id,
  recipient,
  type,
  x,
  y,
  isRequired,
  isFinalized,
  onDelete,
  toggleControlRequired,
}) => {
  const color = userColors[recipient.orderId] || {
    border: "#555",
    background: "#eee",
  };
  const [{ isDragging }, dragRef] = useDrag({
    type: "DROPPED_CONTROL",
    item: { id, type, recipient },
    canDrag: !isFinalized,
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
    cursor: isFinalized ? "default" : "move",
  };

  const closeStyle: React.CSSProperties = {
    marginLeft: 8,
    color: "#888",
    cursor: "pointer",
    fontWeight: "normal",
  };

  return (
    <div ref={dragRef} style={containerStyle}>
      <label>
        {type}
        {isRequired && <span style={{ color: "red", marginLeft: 2 }}>*</span>}
      </label>

      {/* Show toggle and delete when not finalized */}
      {!isFinalized && (
        <div style={{ display: "flex", alignItems: "center" }}>
          {toggleControlRequired && (
            <span
              style={{
                marginRight: 4,
                color: "#666",
                cursor: "pointer",
                fontSize: "12px",
              }}
              onClick={() => toggleControlRequired(id)}
              title={isRequired ? "Mark as Optional" : "Mark as Required"}
            >
              {isRequired ? "Req" : "Opt"}
            </span>
          )}
          <span style={closeStyle} onClick={() => onDelete(id)}>
            ✖
          </span>
        </div>
      )}

      {/* Show lock icon when finalized */}
      {isFinalized && (
        <span
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            background: "#fff",
            borderRadius: "50%",
            padding: "2px",
            fontSize: 12,
            color: "#888",
            boxShadow: "0 0 3px rgba(0,0,0,0.2)",
          }}
          title="Locked"
        >
          🔒
        </span>
      )}
    </div>
  );
};

export default DroppedItem;
