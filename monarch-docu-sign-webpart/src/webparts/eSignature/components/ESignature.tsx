import * as React from "react";
import styles from "./ESignature.module.scss";
import type { IESignatureProps } from "./IESignatureProps";
import DnDContext from "./DnDContext";
import PDFViewer from "./pdfViewer/PDFViewer";
import { Provider } from "react-redux";
import { store } from "../store/store";
//https://monarch360demo.sharepoint.com/sites/DeveloperSandbox/Sandbox%20Document%20Library/Curriculum%20Circular_Inspiring%20VI.pdf

export default class ESignature extends React.Component<IESignatureProps> {
  public render(): React.ReactElement<IESignatureProps> {
    const { hasTeamsContext } = this.props;
    const fileUrl =
      "https://monarch360demo.sharepoint.com/sites/DeveloperSandbox/Sandbox%20Document%20Library/Curriculum%20Circular_Inspiring%20VI.pdf";
    const fileName = "Curriculum Circular_Inspiring VI.pdf";
    return (
      <section
        className={`${styles.eSignature} ${
          hasTeamsContext ? styles.teams : ""
        }`}
      >
        <Provider store={store}>
          <DnDContext>
            <PDFViewer
              fileUrl={fileUrl}
              fileName={fileName}
              context={this.props.context}
            />
          </DnDContext>
        </Provider>
      </section>
    );
  }
}
