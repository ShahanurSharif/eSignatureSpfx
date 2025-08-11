import {
  Stack,
  Label,
  IStackTokens,
  TextField,
  Toggle,
  Persona,
  PersonaSize,
  StackItem,
} from "@fluentui/react";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  updateMessage,
  updateSigningMode,
  updateTitle,
} from "../../store/store";
import { SigningMode } from "../common/Types";

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
    if (newValue) {
      dispatch(updateTitle(newValue));
    }
  };

  const handleMessageChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    if (newValue) {
      dispatch(updateMessage(newValue));
    }
  };

  const handleSigningModeChange = (mode: SigningMode) => {
    dispatch(updateSigningMode(mode));
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
        label="Recipients must sign in order"
        inlineLabel
        disabled={recipients.length <= 1}
        checked={signingMode === "SEQUENTIAL"}
        onChange={(e, checked) =>
          handleSigningModeChange(checked ? "SEQUENTIAL" : "PARALLEL")
        }
      />
      <Stack tokens={{ childrenGap: 10 }}>
        {recipients.map((r) => (
          <Stack horizontal verticalAlign="center" key={r.userId}>
            <StackItem grow>
              <Persona
                text={r.name}
                secondaryText={r.emailId}
                size={PersonaSize.size40}
              />
            </StackItem>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default SendEmail;
