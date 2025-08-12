import { ListViewCommandSetContext } from "@microsoft/sp-listview-extensibility";

export enum IESignatureStep {
  Step_1,
  Step_2,
  Step_3,
}

export type IESignatureStatus = "NEW" | "PENDING" | "COMPLETED" | "CANCELLED";
export type Type = "SIGNATURE" | "INITIAL" | "DATE";
export type SigningMode = "PARALLEL" | "SEQUENTIAL";

export interface IRecipientsProps {
  context: ListViewCommandSetContext;
}

export interface IRecipient {
  emailId: string;
  name: string;
  initials: string;
  userId: string;
  orderId: number;
}

export interface IDroppedControl {
  id: string;
  recipient: IRecipient;
  type: Type;
  x: number;
  y: number;
  page: number;
  isRequired: boolean;
  isReadOnly: boolean;
  isFinalized: boolean; // Indicates if the control is finalized
  value?: string; // For text fields
}

export interface IDroppedItemProps extends IDroppedControl {
  onMove: (id: string, x: number, y: number, page: number) => void;
  onDelete: (id: string) => void;
  toggleControlRequired?: (id: string) => void;
}

export interface IPDFViewerProps {
  fileUrl: string;
  fileName: string;
  context: ListViewCommandSetContext;
}

export interface IControlPaletteProps {
  recipient: IRecipient;
}

export interface IRequest {
  id: string;
  name: string;
  documentUri: string;
  siteUri: string;
  message: string;
  targetFolderUri: string;
  signingMode: SigningMode;
  recipients: IRecipient[];
  controls: IDroppedControl[];
}

export const userColors: Record<
  string,
  { border: string; background: string }
> = {
  "1": { border: "#1e3a8a", background: "#dbeafe" },
  "2": { border: "#7c2d12", background: "#fee2e2" },
  "3": { border: "#065f46", background: "#d1fae5" },
  "4": { border: "#4b5563", background: "#e5e7eb" },
  "5": { border: "#9a3412", background: "#fef3c7" },
  "6": { border: "#0f172a", background: "#c7d2fe" },
  "7": { border: "#6d28d9", background: "#ede9fe" },
  "8": { border: "#064e3b", background: "#a7f3d0" },
  "9": { border: "#b91c1c", background: "#fecaca" },
  "10": { border: "#2563eb", background: "#bfdbfe" },
};
