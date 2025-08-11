import { IStackTokens, Label, Stack } from "@fluentui/react";
import * as React from "react";
import "./Fields.scss";
import ControlPalette from "../controlPalette/ControlPalette";
import { WebPartContext } from "@microsoft/sp-webpart-base";

const stackTokens: IStackTokens = { childrenGap: 10 };

type IFieldsProps = {
  context: WebPartContext;
};

// TODO: remove as any
const Fields: React.FC<IFieldsProps> = ({ context }) => {
  return (
    <Stack tokens={stackTokens} className="white-label">
      <Label>
        <span style={{ fontWeight: 600 }}>Step 2 of 3</span>: Select a field,
        then use your mouse or keyboard to drag or place it on the document.
      </Label>
      <ControlPalette />
    </Stack>
  );
};

export default Fields;
