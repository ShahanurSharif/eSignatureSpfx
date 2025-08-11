import * as React from "react";
import { Stack, Persona, PersonaSize } from "@fluentui/react";
import { IRecipient } from "../common/Types";

const Recipient: React.FC<IRecipient> = ({ name, emailId }: IRecipient) => {
  return (
    <Stack grow horizontalAlign="start" styles={{ root: { marginLeft: 12 } }}>
      <Persona
        text={name}
        secondaryText={emailId}
        size={PersonaSize.size40}
        styles={{
          root: {
            minWidth: 175,
            maxWidth: 300,
          },
          primaryText: { fontWeight: 600 },
        }}
      />
    </Stack>
  );
};

export default Recipient;
