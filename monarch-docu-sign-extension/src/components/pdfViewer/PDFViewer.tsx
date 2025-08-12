import * as React from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import CustomPanel from "../customPanel/CustomPanel";
import { IDroppedControl, IPDFViewerProps } from "../common/Types";
import "./PDFViewer.scss";
import { PDFDocumentProxy } from "pdfjs-dist";
import { DocumentInitParameters } from "pdfjs-dist/types/src/display/api";
import { v4 as uuidv4 } from "uuid";
import PageDropZone from "../pageDropZone/PageDropZone";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addControl,
  moveControl,
  removeControl,
  toggleControlRequired,
  updateRequest,
} from "../../store/store";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFViewer: React.FC<IPDFViewerProps> = ({
  fileUrl,
  fileName,
  context,
}) => {
  const [pdfDoc, setPdfDoc] = React.useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = React.useState(0);

  const viewerRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const droppedControls = useAppSelector((state) => state.esignature.controls);

  React.useEffect(() => {
    const loadPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(
        fileUrl as DocumentInitParameters
      );
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);

      const newGuid = uuidv4();
      dispatch(
        updateRequest({
          id: newGuid,
          documentUri: fileUrl,
          name: fileName,
          siteUri: context.pageContext.web.absoluteUrl,
          targetFolderUri: context.pageContext.web.absoluteUrl,
        })
      );
    };
    loadPDF();
  }, [fileUrl]);

  const handleControlDrop = (control: IDroppedControl) => {
    console.log(`🎯 PDFViewer handleControlDrop called:`, control);
    dispatch(addControl(control));
    console.log(`✅ addControl dispatched`);
  };

  const handleControlMove = (
    id: string,
    x: number,
    y: number,
    page: number
  ) => {
    dispatch(moveControl({ id, x, y, page }));
  };

  const handleControlDelete = (id: string) => {
    dispatch(removeControl(id));
  };

  const handleToggleControlRequired = (id: string) => {
    dispatch(toggleControlRequired(id));
  };

  return (
    <div className="pdf-viewer" ref={viewerRef}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          height: "100%",
          textAlign: "center",
          width: "75%",
          border: "1px, solid red",
        }}
      >
        {pdfDoc &&
          Array.from(new Array(numPages), (_, index) => (
            <PageDropZone
              key={`page-${index + 1}`}
              pdf={pdfDoc}
              page={index + 1}
              controls={droppedControls}
              onDrop={handleControlDrop}
              onMove={handleControlMove}
              onDelete={handleControlDelete}
              onToggleRequired={handleToggleControlRequired}
            />
          ))}
      </div>
      <div
        style={{
          height: "100%",
          width: "25%",
          background: "rgb(31, 31, 31)",
          color: "#fff",
        }}
      >
        <CustomPanel context={context} fileUrl={fileUrl} isLoading={false} />
      </div>
    </div>
  );
};

export default PDFViewer;
