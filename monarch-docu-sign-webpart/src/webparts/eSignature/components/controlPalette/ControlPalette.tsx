import * as React from "react";
import { useDrag } from "react-dnd";
import {
  IControlPaletteProps,
  IRecipient,
  Type,
  userColors,
} from "../common/Types";
import "./ControlPalette.scss";
import { Icon, Stack } from "@fluentui/react";
import Recipient from "../recipients/Recipient";
import { useAppSelector } from "../../store/hooks";

const ControlPalette: React.FC<IControlPaletteProps> = () => {
  const recipients = useAppSelector((state) => state.esignature.recipients);
  const controls: Type[] = ["SIGNATURE", "INITIAL", "DATE"];
  const droppedControls = useAppSelector((state) => state.esignature.controls);

  const isControlUsed = (type: string, userId: string) =>
    droppedControls.some(
      (control) => control.type === type && control.recipient.userId === userId
    );

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      {recipients.map((recipient) => {
        const color = userColors[recipient.orderId] || {
          border: "#888",
          background: "#f0f0f0",
        };
        return (
          <>
            <Stack
              key={recipient.orderId}
              horizontal
              verticalAlign="center"
              styles={{
                root: {
                  padding: "8px 12px",
                  borderRadius: 6,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  alignItems: "center",
                  backgroundColor: color.background,
                  border: `2px solid ${color.border}`,
                },
              }}
            >
              <Recipient {...recipient} />
            </Stack>
            <Stack tokens={{ childrenGap: 4 }} horizontalAlign="center">
              {controls.map((type) => (
                <DraggableItem
                  key={type}
                  type={type}
                  isDropped={isControlUsed(type, recipient.userId)}
                  recipient={recipient}
                />
              ))}
            </Stack>
          </>
        );
      })}
    </Stack>
  );
};

const DraggableItem = ({
  type,
  isDropped,
  recipient,
}: {
  type: Type;
  isDropped: boolean;
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
      <span style={{ flex: 1 }}>{type}</span>
      {isDropped && (
        <Icon
          iconName="CheckMark"
          styles={{
            root: {
              color: "green",
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: 8,
            },
          }}
        />
      )}
    </div>
  );
};

export default ControlPalette;
