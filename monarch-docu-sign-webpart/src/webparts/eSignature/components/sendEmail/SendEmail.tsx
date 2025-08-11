import { Stack, Label, IStackTokens, TextField, Toggle } from "@fluentui/react";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateMessage, updateTitle } from "../../store/store";
import { userColors } from "../common/Types";
import Recipient from "../recipients/Recipient";

const stackTokens: IStackTokens = { childrenGap: 10 };

const SendEmail: React.FC = () => {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.esignature);
  const recipients = request.recipients;
  const title = request.title;
  const message = request.message;
  const signingMode = request.signingMode;

  const handleTitleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    dispatch(updateTitle(newValue || ""));
  };

  const handleMessageChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    if (newValue) {
      dispatch(updateMessage(newValue));
    }
  };

  return (
    <Stack tokens={stackTokens} className="white-label">
      <Label>
        <span style={{ fontWeight: 600 }}>Step 3 of 3</span>: Review and send
        the request.
      </Label>
      <TextField
        label="Request title"
        required
        value={title}
        onChange={handleTitleChange}
      />
      <TextField
        label="Optional message"
        multiline
        rows={3}
        resizable={false}
        value={message}
        onChange={handleMessageChange}
      />
      <Toggle
        label="Signing mode"
        disabled
        offText="All recipients can sign independently"
        onText="Recipients must sign in order"
        checked={signingMode === "SEQUENTIAL"}
      />
      <Stack tokens={{ childrenGap: 10 }}>
        {recipients.map((r) => {
          const color = userColors[r.orderId] || {
            border: "#888",
            background: "#f0f0f0",
          };
          return (
            <Stack
              key={r.orderId}
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
              <Recipient {...r} />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default SendEmail;
