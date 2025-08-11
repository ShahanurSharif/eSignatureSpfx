import {
  IBasePickerStyles,
  IconButton,
  IStackTokens,
  Label,
  Persona,
  PersonaSize,
  Stack,
  StackItem,
  Toggle,
} from "@fluentui/react";
import {
  IPeoplePickerContext,
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as React from "react";
import "./Recipients.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addRecipient,
  removeRecipient,
  updateSigningMode,
} from "../../store/store";
import { IRecipient, IRecipientsProps, SigningMode } from "../common/Types";

const stackTokens: IStackTokens = { childrenGap: 10 };

const PeoplePickerStyle: Partial<IBasePickerStyles> = {
  root: {
    color: "rgb(255, 255, 255)",
  },
  input: {
    color: "rgb(255, 255, 255)",
  },
  text: {
    color: "rgb(255, 255, 255)",
  },
};

// TODO: remove as any
const Recipients: React.FC<IRecipientsProps> = ({ context }) => {
  const peoplePickerContext: IPeoplePickerContext = {
    absoluteUrl: context.pageContext.web.absoluteUrl,
    msGraphClientFactory: context.msGraphClientFactory as any,
    spHttpClient: context.spHttpClient as any,
  };

  const dispatch = useAppDispatch();
  const recipients = useAppSelector((state) => state.esignature.recipients);

  const getPeoplePickerItems = (items: any[]) => {
    console.log("Items:", items);

    const newRecipient: IRecipient = {
      emailId: items[0].secondaryText,
      name: items[0].text,
      initials: items[0].imageInitials || items[0].text.charAt(0).toUpperCase(),
      userId: items[0].secondaryText,
      orderId: recipients.length + 1,
    };

    dispatch(addRecipient(newRecipient));
  };

  const removeRecipientFromSelection = (id: string) => {
    dispatch(removeRecipient(id));
  };

  const handleSigningModeChange = (signingMode: SigningMode) => {
    dispatch(updateSigningMode(signingMode));
  };

  return (
    <Stack tokens={stackTokens} className="white-label">
      <Label>
        <span style={{ fontWeight: 600 }}>Step 1 of 3</span>: Add names or email
        addresses. <br /> Invite people to electronically sign this document.
        The final document with all signatures will be saved to the same
        location as this original.
      </Label>
      <Toggle
        label="Recipients must sign in order"
        inlineLabel
        disabled={recipients.length <= 1}
        onChange={(e, checked) =>
          handleSigningModeChange(checked ? "SEQUENTIAL" : "PARALLEL")
        }
      />
      <PeoplePicker
        context={peoplePickerContext}
        titleText="Recipients"
        personSelectionLimit={1}
        groupName={""} // Leave this blank in case you want to filter from all users
        required={false}
        searchTextLimit={1}
        onChange={getPeoplePickerItems}
        principalTypes={[PrincipalType.User]}
        styles={PeoplePickerStyle}
        key={recipients.length}
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
            <IconButton
              iconProps={{ iconName: "Cancel" }}
              title="Remove"
              ariaLabel="Remove"
              onClick={() => removeRecipientFromSelection(r.userId)}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default Recipients;
