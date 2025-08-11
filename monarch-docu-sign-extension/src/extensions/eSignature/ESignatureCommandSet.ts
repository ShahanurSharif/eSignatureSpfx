import * as ReactDOM from "react-dom";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseListViewCommandSet,
  IListViewCommandSetListViewUpdatedParameters,
  RowAccessor,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
} from "@microsoft/sp-listview-extensibility";
import { override } from "@microsoft/decorators";
import * as React from "react";
import { ALLOWED_EXTENSIONS } from "../../components/common/Constants";
import PdfContainer from "../../components/pdfContainer/PdfContainer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IESignatureCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
}

const LOG_SOURCE: string = "ESignatureCommandSet";
const PANEL_CONTAINER_ID = "eSignDocContainer";

export default class ESignatureCommandSet extends BaseListViewCommandSet<IESignatureCommandSetProperties> {
  private onDismiss(): void {
    const panelContainer = document.getElementById(PANEL_CONTAINER_ID);
    if (panelContainer) {
      ReactDOM.unmountComponentAtNode(panelContainer);
      panelContainer.remove();
    }
  }

  private async _renderPanel(
    selectedItem: RowAccessor,
    visibility: boolean
  ): Promise<void> {
    let panelContainer = document.getElementById(PANEL_CONTAINER_ID);

    if (!panelContainer) {
      panelContainer = document.createElement("div");
      panelContainer.id = PANEL_CONTAINER_ID;
      document.body.appendChild(panelContainer);
    }

    const fileUrl = selectedItem?.getValueByName("FileRef");
    const fileName = selectedItem?.getValueByName("FileLeafRef");

    const element = React.createElement(PdfContainer, {
      isOpen: visibility,
      fileUrl,
      fileName,
      context: this.context,
      onDismiss: this.onDismiss,
    });

    if (panelContainer) {
      ReactDOM.render(element, document.getElementById(PANEL_CONTAINER_ID));
    }
  }

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, "Initialized ESignatureCommandSet");

    // initial state of the command's visibility
    const sendForSignature: Command = this.tryGetCommand("SendForSignature");

    sendForSignature.visible = false;

    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case "SendForSignature":
        this._renderPanel(event.selectedRows[0], true);
        break;
      default:
        throw new Error("Unknown command");
    }
  }

  @override
  public onListViewUpdated(
    event: IListViewCommandSetListViewUpdatedParameters
  ): void {
    Log.info(LOG_SOURCE, "List view state changed");

    const sendForSignature: Command = this.tryGetCommand("SendForSignature");

    if (sendForSignature && event.selectedRows.length === 1) {
      // This command should be hidden unless exactly one row is selected.
      const fileName = event.selectedRows[0].getValueByName("FileLeafRef");
      const fileExtension = fileName.split(".").pop()?.toLowerCase();
      sendForSignature.visible = ALLOWED_EXTENSIONS.indexOf(fileExtension) > -1;
    }

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }
}
