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
  console.log(`📖 PDFVIEWER: PDFViewer component initializing`);
  console.log(`  📄 File: ${fileName}`);
  console.log(`  🔗 URL: ${fileUrl}`);
  console.log(`  🌐 SharePoint Context:`, !!context);
  
  const [pdfDoc, setPdfDoc] = React.useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = React.useState(0);

  const viewerRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const droppedControls = useAppSelector((state) => state.esignature.controls);
  console.log(`📊 PDFVIEWER: Current dropped controls count: ${droppedControls.length}`);

  React.useEffect(() => {
    console.log(`🔄 PDFVIEWER: fileUrl effect triggered`);
    console.log(`🚀 PDFVIEWER: Starting PDF load process for: ${fileName}`);
    
    const loadPDF = async () => {
      try {
        console.log(`📥 PDFVIEWER: Creating PDF loading task...`);
        const loadingTask = pdfjsLib.getDocument(
          fileUrl as DocumentInitParameters
        );
        console.log(`⏳ PDFVIEWER: Waiting for PDF promise...`);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        
        console.log(`✅ PDFVIEWER: PDF loaded successfully`);
        console.log(`📋 PDFVIEWER: PDF Details:`, {
          numPages: pdf.numPages,
          fingerprints: pdf.fingerprints,
          fileName: fileName
        });

        const newGuid = uuidv4();
        console.log(`🆔 PDFVIEWER: Generated request ID: ${newGuid}`);
        console.log(`📝 PDFVIEWER: Dispatching updateRequest to store...`);
        dispatch(
          updateRequest({
            id: newGuid,
            documentUri: fileUrl,
            name: fileName,
            siteUri: context.pageContext.web.absoluteUrl,
            targetFolderUri: context.pageContext.web.absoluteUrl,
          })
        );
        console.log(`✅ PDFVIEWER: Store update dispatched successfully`);
      } catch (error) {
        console.error(`❌ PDFVIEWER: Failed to load PDF:`, error);
        console.error(`🔗 PDFVIEWER: Failed URL: ${fileUrl}`);
      }
    };
    loadPDF();
  }, [fileUrl]);

  const handleControlDrop = (control: IDroppedControl) => {
    console.log(`🎯 PDFViewer handleControlDrop called:`, control);
    console.log(`📋 Control details - ID: ${control.id}, Type: ${control.type}, Position: (${control.x}, ${control.y}), Page: ${control.page}`);
    console.log(`👤 Recipient: ${control.recipient.name} (Order: ${control.recipient.orderId})`);
    console.log(`⚙️ Settings - Required: ${control.isRequired}, ReadOnly: ${control.isReadOnly}, Finalized: ${control.isFinalized}`);
    
    try {
      console.log(`🚀 Dispatching addControl action...`);
      dispatch(addControl(control));
      console.log(`✅ addControl dispatched successfully`);
    } catch (error) {
      console.error(`❌ Error dispatching addControl:`, error);
    }
  };

  const handleControlMove = (
    id: string,
    x: number,
    y: number,
    page: number
  ) => {
    console.log(`🔄 PDFViewer handleControlMove called:`);
    console.log(`📍 Moving control ID: ${id} to position (${x}, ${y}) on page ${page}`);
    
    try {
      console.log(`🚀 Dispatching moveControl action...`);
      dispatch(moveControl({ id, x, y, page }));
      console.log(`✅ moveControl dispatched successfully`);
    } catch (error) {
      console.error(`❌ Error dispatching moveControl:`, error);
    }
  };

  const handleControlDelete = (id: string) => {
    console.log(`🗑️ PDFViewer handleControlDelete called for ID: ${id}`);
    
    try {
      console.log(`🚀 Dispatching removeControl action...`);
      dispatch(removeControl(id));
      console.log(`✅ removeControl dispatched successfully`);
    } catch (error) {
      console.error(`❌ Error dispatching removeControl:`, error);
    }
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
