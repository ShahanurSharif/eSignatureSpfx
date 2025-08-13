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
import DnDContext from "../../components/DnDContext";
import { Provider } from "react-redux";
import { store } from "../../store/store";

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
  console.log(`EXTENSION: Dialog dismiss requested - closing eSignature panel`);
    const panelContainer = document.getElementById(PANEL_CONTAINER_ID);
    if (panelContainer) {
      console.log(`🧹 EXTENSION: Unmounting React components and removing panel`);
      ReactDOM.unmountComponentAtNode(panelContainer);
      panelContainer.remove();
  console.log(`EXTENSION: Panel closed and cleaned up`);
    } else {
  console.warn(`EXTENSION: Panel container not found during dismiss`);
    }
  }

  private async _renderPanel(
    selectedItem: RowAccessor,
    visibility: boolean
  ): Promise<void> {
    console.log(`🎯 EXTENSION: _renderPanel called - visibility: ${visibility}`);
    
    let panelContainer = document.getElementById(PANEL_CONTAINER_ID);

    if (!panelContainer) {
  console.log(`EXTENSION: Creating new panel container DOM element`);
      panelContainer = document.createElement("div");
      panelContainer.id = PANEL_CONTAINER_ID;
      document.body.appendChild(panelContainer);
  console.log(`EXTENSION: Panel container added to SharePoint page body`);
    } else {
      console.log(`♻️ EXTENSION: Reusing existing panel container`);
    }

    const fileUrl = selectedItem?.getValueByName("FileRef");
    const fileName = selectedItem?.getValueByName("FileLeafRef");

  console.log(`EXTENSION: Rendering PdfContainer React component...`);
  console.log(`  File: ${fileName}`);
  console.log(`  URL: ${fileUrl}`);
    console.log(`  👁️ Visible: ${visibility}`);

    const element = React.createElement(
      Provider,
      { store },
      React.createElement(
        DnDContext,
        null,
        React.createElement(PdfContainer, {
          isOpen: visibility,
          fileUrl,
          fileName,
          context: this.context,
          onDismiss: this.onDismiss.bind(this),
        })
      )
    );

    if (panelContainer) {
  ReactDOM.render(element, document.getElementById(PANEL_CONTAINER_ID));
  console.log(`EXTENSION: PdfContainer rendered to DOM`);
    } else {
  console.error(`EXTENSION: Failed to find panel container for rendering`);
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
  console.log(`EXTENSION: eSignature command executed on SharePoint AllItems.aspx`);
  console.log(`EXTENSION: Selected file:`, event.selectedRows[0]?.getValueByName("FileLeafRef"));
  console.log(`EXTENSION: File URL:`, event.selectedRows[0]?.getValueByName("FileRef"));
        console.log(`📱 Opening eSignature panel/dialog...`);
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
