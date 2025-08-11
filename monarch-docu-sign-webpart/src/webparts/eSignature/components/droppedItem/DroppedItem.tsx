import * as React from "react";
import { IDroppedItemProps, userColors } from "../common/Types";
import { useDrag } from "react-dnd";
import {
  ContextualMenu,
  Icon,
  IconButton,
  IContextualMenuProps,
} from "@fluentui/react";

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
  const [menuTarget, setMenuTarget] = React.useState<HTMLElement | null>(null);
  const [showMenu, setShowMenu] = React.useState(false);

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
    height: "25px",
    width: "150px",
    cursor: isFinalized ? "default" : "move",
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuTarget(event.currentTarget);
    setShowMenu(true);
  };

  const dismissMenu = () => {
    setShowMenu(false);
    setMenuTarget(null);
  };

  const menuItems: IContextualMenuProps["items"] = [
    {
      key: "toggleRequired",
      text: isRequired ? "Mark as Optional" : "Mark as Required",
      iconProps: {
        iconName: "Important",
      },
      onClick: () => {
        toggleControlRequired(id);
        dismissMenu();
      },
    },
    {
      key: "delete",
      text: "Delete",
      iconProps: {
        iconName: "Delete",
      },
      onClick: () => {
        onDelete(id);
        dismissMenu();
      },
    },
  ];

  return (
    <div ref={dragRef} style={containerStyle}>
      <label>
        {type}
        {isRequired && <span style={{ color: "red", marginLeft: 2 }}>*</span>}
      </label>

      {/* Lock icon when finalized */}
      {isFinalized && (
        <Icon
          iconName="Lock"
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            background: "#fff",
            borderRadius: "50%",
            padding: "2px",
            fontSize: 16,
            color: "#888",
            boxShadow: "0 0 3px rgba(0,0,0,0.2)",
          }}
          title="Locked"
        />
      )}

      {/* Show menu when editable */}
      {!isFinalized && (
        <>
          <IconButton
            iconProps={{ iconName: "MoreVertical" }}
            title="Field settings"
            onClick={openMenu}
            styles={{
              root: {
                marginLeft: 4,
                backgroundColor: color.background,
              },
              rootDisabled: {
                backgroundColor: color.background,
              },
              rootHovered: {
                backgroundColor: color.background,
              },
              rootPressed: {
                backgroundColor: color.border,
              },
            }}
          />

          {showMenu && (
            <ContextualMenu
              items={menuItems}
              target={menuTarget}
              onDismiss={dismissMenu}
              directionalHint={12} // bottomRightEdge
            />
          )}
        </>
      )}
    </div>
  );
};

export default DroppedItem;
