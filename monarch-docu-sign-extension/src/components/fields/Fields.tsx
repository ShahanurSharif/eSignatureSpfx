import { IStackTokens, Label, Stack } from "@fluentui/react";
import * as React from "react";
import "./Fields.scss";
import ControlPalette from "../controlPalette/ControlPalette";
import { useAppSelector } from "../../store/hooks";
import { ListViewCommandSetContext } from "@microsoft/sp-listview-extensibility";

const stackTokens: IStackTokens = { childrenGap: 10 };

type IFieldsProps = {
  context: ListViewCommandSetContext;
};

// TODO: remove as any
const Fields: React.FC<IFieldsProps> = ({ context }) => {
  const recipients = useAppSelector((state) => state.esignature.recipients);

  return (
    <Stack tokens={stackTokens} className="white-label">
      <Label>
        <span style={{ fontWeight: 600 }}>Step 2 of 3</span>: Select a field,
        then use your mouse or keyboard to drag or place it on the document.
      </Label>
      {recipients.map((recipient) => (
        <ControlPalette recipient={recipient} />
      ))}
    </Stack>
  );
};

export default Fields;
