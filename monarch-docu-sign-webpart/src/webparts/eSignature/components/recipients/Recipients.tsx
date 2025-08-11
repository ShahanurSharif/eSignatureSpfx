import {
  IBasePickerStyles,
  IconButton,
  IStackTokens,
  Label,
  Stack,
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
  moveRecipientUp,
  moveRecipientDown,
} from "../../store/store";
import {
  IRecipient,
  IRecipientsProps,
  SigningMode,
  userColors,
} from "../common/Types";
import Recipient from "./Recipient";

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
  const recipients = useAppSelector((state) =>
    [...state.esignature.recipients].sort((a, b) => a.orderId - b.orderId)
  );
  const signingMode = useAppSelector((state) => state.esignature.signingMode);
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

  const moveRecipient = (id: string, direction: "UP" | "DOWN") => {
    if (direction === "UP") {
      dispatch(moveRecipientUp(id));
    } else {
      dispatch(moveRecipientDown(id));
    }
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
        label="Signing mode"
        disabled={recipients.length <= 1}
        offText="All recipients can sign independently"
        onText="Recipients must sign in order"
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
        {recipients.map((recipient, index) => {
          const color = userColors[recipient.orderId] || {
            border: "#888",
            background: "#f0f0f0",
          };
          return (
            <Stack
              key={recipient.orderId}
              horizontal
              verticalAlign="center"
              styles={{
                root: {
                  padding: "8px 12px",
                  backgroundColor: color.background,
                  border: `2px solid ${color.border}`,
                  borderRadius: 6,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  alignItems: "center",
                },
              }}
            >
              {/* Left Side: Up/Down arrows stacked vertically */}
              {recipients.length > 1 && signingMode === "SEQUENTIAL" && (
                <Stack tokens={{ childrenGap: 4 }} horizontalAlign="center">
                  <IconButton
                    iconProps={{ iconName: "ChevronUpSmall" }}
                    title="Move Up"
                    ariaLabel="Move Up"
                    onClick={() => moveRecipient(recipient.emailId, "UP")}
                    disabled={index === 0}
                    styles={{
                      root: {
                        backgroundColor: color.background,
                      },
                      rootDisabled: {
                        backgroundColor: color.background,
                      },
                      rootHovered: {
                        backgroundColor: color.background,
                        border: `2px solid ${color.border}`,
                      },
                      rootPressed: {
                        backgroundColor: color.border,
                        border: `2px solid ${color.border}`,
                      },
                    }}
                  />
                  <IconButton
                    iconProps={{ iconName: "ChevronDownSmall" }}
                    title="Move Down"
                    ariaLabel="Move Down"
                    onClick={() => moveRecipient(recipient.emailId, "DOWN")}
                    disabled={index === recipients.length - 1}
                    styles={{
                      root: {
                        backgroundColor: color.background,
                      },
                      rootDisabled: {
                        backgroundColor: color.background,
                      },
                      rootHovered: {
                        backgroundColor: color.background,
                        border: `2px solid ${color.border}`,
                      },
                      rootPressed: {
                        backgroundColor: color.border,
                        border: `2px solid ${color.border}`,
                      },
                    }}
                  />
                </Stack>
              )}

              {/* Middle: Persona */}
              <Recipient {...recipient} />

              {/* Right Side: Delete */}
              <IconButton
                iconProps={{ iconName: "Delete" }}
                title="Remove"
                ariaLabel="Remove"
                onClick={() => removeRecipientFromSelection(recipient.emailId)}
                styles={{
                  root: {
                    backgroundColor: color.background,
                  },
                  rootDisabled: {
                    backgroundColor: color.background,
                  },
                  rootHovered: {
                    backgroundColor: color.background,
                    border: `2px solid ${color.border}`,
                  },
                  rootPressed: {
                    backgroundColor: color.border,
                    border: `2px solid ${color.border}`,
                  },
                }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default Recipients;
