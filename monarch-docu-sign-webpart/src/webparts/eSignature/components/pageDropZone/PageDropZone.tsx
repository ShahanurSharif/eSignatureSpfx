import { useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import DroppedItem from "../droppedItem/DroppedItem";
import { Type, IDroppedControl, IRecipient } from "../common/Types";
import { PDFDocumentProxy } from "pdfjs-dist";
import * as React from "react";

type PageDropZoneProps = {
  page: number;
  pdf: PDFDocumentProxy;
  controls: IDroppedControl[];
  onDrop: (control: IDroppedControl) => void;
  onMove: (id: string, x: number, y: number, page: number) => void;
  onDelete: (id: string) => void;
  onToggleRequired: (id: string) => void;
};

const PageDropZone: React.FC<PageDropZoneProps> = ({
  page,
  pdf,
  controls,
  onDrop,
  onMove,
  onDelete,
  onToggleRequired,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPage = async () => {
      const pdfPage = await pdf.getPage(page);
      const viewport = pdfPage.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      if (!containerRef.current) return;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.dataset.page = page.toString();

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      containerRef.current.appendChild(canvas);

      await pdfPage.render(renderContext).promise;
    };

    renderPage();
  }, [page, pdf]);

  const [, dropRef] = useDrop({
    accept: ["CONTROL", "DROPPED_CONTROL"],
    drop: (
      item: { id: string; type: Type; recipient: IRecipient },
      monitor
    ) => {
      const offset = monitor.getClientOffset();
      const rect = containerRef.current?.getBoundingClientRect();

      if (!offset || !rect) return;

      const x = offset.x - rect.left - 60;
      const y = offset.y - rect.top - 20;

      if (item.id) {
        onMove(item.id, x, y, page);
      } else {
        // It's a new item from ControlPalette
        const newDropped: IDroppedControl = {
          id: Date.now().toString(),
          recipient: item.recipient,
          type: item.type,
          x,
          y,
          page,
          isRequired: item.type === "SIGNATURE",
          isReadOnly: false,
          isFinalized: false, // New controls are not finalized by default
        };
        onDrop(newDropped);
      }
    },
  });

  dropRef(containerRef);

  return (
    <div
      ref={containerRef}
      id={`page-${page}`}
      className="pdf-page-dropzone"
      style={{
        position: "relative",
        marginBottom: "16px",
        display: "inline-block",
      }}
    >
      <canvas ref={canvasRef} />
      {controls.map((control) =>
        control.page === page ? (
          <DroppedItem
            key={control.id}
            {...control}
            onMove={onMove}
            onDelete={onDelete}
            toggleControlRequired={onToggleRequired}
          />
        ) : null
      )}
    </div>
  );
};

export default PageDropZone;
