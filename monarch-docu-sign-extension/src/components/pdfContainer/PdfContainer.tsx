import * as React from "react";
import DnDContext from "../DnDContext";
import { IPanelStyles, Panel, PanelType, Stack, Text } from "@fluentui/react";
import PDFViewer from "../pdfViewer/PDFViewer";
import { ListViewCommandSetContext } from "@microsoft/sp-listview-extensibility";
import { Provider } from "react-redux";
import { store } from "../../store/store";

type IPdfContainerProps = {
  isOpen: boolean;
  fileUrl: string;
  fileName: string;
  context: ListViewCommandSetContext;
  onDismiss: () => void;
};

const panelStyle: Partial<IPanelStyles> = {
  root: {
    top: "0px",
    right: "0px",
    bottom: "0px",
    borderLeft: `1px solid #e1dfdd`, // SharePoint neutral light border
    boxShadow:
      "rgba(0, 0, 0, 0.22) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.18) 0px 4.8px 14.4px 0px", // subtle shadow
    backgroundColor: "rgba(31, 31, 31, 0.88)",
    color: "rgb(255, 255, 255)",
    outline: "transparent solid 3px",
    display: "flex",
    flexDirection: "column",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  main: {
    background: "transparent",
  },
  header: {
    opacity: "1",
  },
  navigation: {
    justifyContent: "center",
  },
  headerText: {
    color: "rgb(255, 255, 255)",
  },
  closeButton: {
    color: "rgb(255, 255, 255)",
    marginLeft: "75%",
  },
  content: {
    height: "90%",
    padding: "15px",
  },
  commands: {
    backgroundColor: "rgb(31, 31, 31)",
    padding: "5px",
  },
};

const PdfContainer: React.FC<IPdfContainerProps> = ({
  isOpen,
  fileUrl,
  fileName,
  context,
  onDismiss,
}) => {
  const onRenderHeader = () => (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="space-between"
      styles={{
        root: {
          padding: "12px 16px",
        },
      }}
    >
      {/* Left: Optional back button or empty space */}
      <div style={{ width: 40 }}></div>

      {/* Center: File name */}
      <Text
        variant="large"
        block
        styles={{
          root: {
            textAlign: "center",
            flexGrow: 1,
            color: "rgb(255, 255, 255)",
          },
        }}
      >
        {fileName}
      </Text>
    </Stack>
  );

  return (
    <Panel
      isOpen={isOpen}
      styles={panelStyle}
      type={PanelType.custom}
      customWidth="100%"
      onRenderHeader={onRenderHeader}
      onDismiss={onDismiss}
      isBlocking={true}
      headerText="Sign Document"
      closeButtonAriaLabel="Close"
    >
      <Provider store={store}>
        <DnDContext>
          <PDFViewer fileUrl={fileUrl} fileName={fileName} context={context} />
        </DnDContext>
      </Provider>
    </Panel>
  );
};

export default PdfContainer;
