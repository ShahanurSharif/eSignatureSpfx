import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IDroppedControl,
  IESignatureStatus,
  IRecipient,
  SigningMode,
} from "../components/common/Types";

interface State {
  id?: string;
  name?: string;
  title?: string;
  documentUri?: string;
  siteUri?: string;
  message?: string;
  targetFolderUri?: string;
  signingMode: SigningMode;
  recipients: IRecipient[];
  controls: IDroppedControl[];
  currentRecipient?: IRecipient;
  esignatureStatus: IESignatureStatus;
}

const initialState: State = {
  id: undefined,
  name: undefined,
  title: undefined,
  documentUri: undefined,
  siteUri: undefined,
  message: undefined,
  targetFolderUri: undefined,
  signingMode: "PARALLEL",
  recipients: [],
  controls: [],
  currentRecipient: undefined,
  esignatureStatus: "NEW",
};

const esignatureSlice = createSlice({
  name: "esignature",
  initialState,
  reducers: {
    addControl(state, action: PayloadAction<IDroppedControl>) {
      state.controls.push(action.payload);
    },
    moveControl(
      state,
      action: PayloadAction<{ id: string; x: number; y: number; page: number }>
    ) {
      const control = state.controls.find((c) => c.id === action.payload.id);
      if (control) {
        control.x = action.payload.x;
        control.y = action.payload.y;
        control.page = action.payload.page;
      }
    },
    removeControl(state, action: PayloadAction<string>) {
      state.controls = state.controls.filter((c) => c.id !== action.payload);
    },
    toggleControlRequired(state, action: PayloadAction<string>) {
      const control = state.controls.find((c) => c.id === action.payload);
      if (control) {
        control.isRequired = !control.isRequired;
      }
    },
    updateControlFinalizeStatus(state, action: PayloadAction<boolean>) {
      state.controls = state.controls.map((control) => ({
        ...control,
        isFinalized: action.payload, // Mark all controls as finalized
      }));
    },
    addRecipient(state, action: PayloadAction<IRecipient>) {
      state.recipients.push(action.payload);
    },
    removeRecipient(state, action: PayloadAction<string>) {
      state.recipients = state.recipients.filter(
        (r) => r.emailId !== action.payload
      );
    },
    moveRecipientUp: (state, action: PayloadAction<string>) => {
      const index = state.recipients.findIndex(
        (r) => r.emailId === action.payload
      );
      if (index > 0) {
        // Swap array positions
        [state.recipients[index - 1], state.recipients[index]] = [
          state.recipients[index],
          state.recipients[index - 1],
        ];

        // Update their `order` property
        const tempOrder = state.recipients[index].orderId;
        state.recipients[index].orderId = state.recipients[index - 1].orderId;
        state.recipients[index - 1].orderId = tempOrder;
      }
    },
    moveRecipientDown: (state, action: PayloadAction<string>) => {
      const index = state.recipients.findIndex(
        (r) => r.emailId === action.payload
      );
      if (index < state.recipients.length - 1 && index !== -1) {
        // Swap array positions
        [state.recipients[index + 1], state.recipients[index]] = [
          state.recipients[index],
          state.recipients[index + 1],
        ];

        // Update their `order` property
        const tempOrder = state.recipients[index].orderId;
        state.recipients[index].orderId = state.recipients[index + 1].orderId;
        state.recipients[index + 1].orderId = tempOrder;
      }
    },
    setCurrentUser(state, action: PayloadAction<IRecipient>) {
      state.currentRecipient = action.payload;
    },
    updateSigningMode(state, action: PayloadAction<SigningMode>) {
      state.signingMode = action.payload;
    },
    updateRequest(state, action: PayloadAction<Partial<State>>) {
      const { id, name, documentUri, siteUri, message, targetFolderUri } =
        action.payload;
      if (!!id) state.id = id;
      if (!!name) state.name = name;
      if (!!name && name.includes(".")) {
        state.title = name.split(".").slice(0, -1).join(".");
      } else {
        state.title = name;
      }
      if (!!documentUri) state.documentUri = documentUri;
      if (!!siteUri) state.siteUri = siteUri;
      if (!!message) state.message = message;
      if (!!targetFolderUri) state.targetFolderUri = targetFolderUri;
    },
    updateTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    updateMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
});

export const {
  addControl,
  moveControl,
  removeControl,
  toggleControlRequired,
  updateControlFinalizeStatus,
  addRecipient,
  removeRecipient,
  moveRecipientDown,
  moveRecipientUp,
  setCurrentUser,
  updateSigningMode,
  updateRequest,
  updateTitle,
  updateMessage,
} = esignatureSlice.actions;

export const store = configureStore({
  reducer: {
    esignature: esignatureSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type { State };
