import { useRef, useEffect, useCallback } from "react";
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
  onToggleRequired?: (id: string) => void;
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
  // Raw DOM node ref we also use for bounds math
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  // React DnD drop spec
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["CONTROL", "DROPPED_CONTROL"],
    collect: (monitor) => {
      const over = monitor.isOver();
      const canDrop = monitor.canDrop();
      const dragItem = monitor.getItem();
      const itemType = monitor.getItemType();
      console.log(`📊 PAGEDROPZONE: Drop zone page ${page} (IN DIALOG) - isOver: ${over}, canDrop: ${canDrop}, itemType: ${String(itemType)}`);
      if (dragItem && over) {
        console.log(`🎯 PAGEDROPZONE: Drag item over page ${page} (IN DIALOG):`, dragItem);
        console.log(`🔍 PAGEDROPZONE: Item validation:`, {
          hasType: !!(dragItem as any).type,
          hasRecipient: !!(dragItem as any).recipient,
          typeValue: (dragItem as any).type,
          recipientName: (dragItem as any).recipient?.name
        });
      } else if (!dragItem) {
        if (over) {
          console.log(`⚠️ PAGEDROPZONE: isOver=true but monitor.getItem() is null (drag source payload missing)`);
        }
      }
      return {
        isOver: over,
      };
    },
    hover: (item, monitor) => {
      const offset = monitor.getClientOffset();
      console.log(`🎯 PAGEDROPZONE: HOVER over page ${page} (IN DIALOG):`, { item, offset });
    },
    drop: (
      item: { id: string; type: Type; recipient: IRecipient },
      monitor
    ) => {
      console.log(`🚀 PAGEDROPZONE: DROP EVENT STARTED on page ${page} (IN DIALOG):`, item);
      console.log(`🔍 PAGEDROPZONE: Monitor state:`, {
        didDrop: monitor.didDrop(),
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
      });
      
      const offset = monitor.getClientOffset();
      const rect = containerRef.current?.getBoundingClientRect();

      console.log(`📍 Drop offset:`, offset);
      console.log(`📦 Container rect:`, rect);
      console.log(`📄 Page container ref:`, !!containerRef.current);

      if (!offset || !rect) {
        console.log(`❌ CRITICAL ERROR - Missing offset or rect - drop cancelled`);
        console.log(`  - offset exists: ${!!offset}`);
        console.log(`  - rect exists: ${!!rect}`);
        console.log(`  - containerRef.current: ${!!containerRef.current}`);
        return;
      }

      const x = offset.x - rect.left - 60;
      const y = offset.y - rect.top - 20;

      console.log(`📐 Calculated position: x=${x}, y=${y} on page ${page}`);

      if (item.id) {
        // It's a repositioned DroppedItem
        console.log(`🔄 MOVING existing control: ${item.id} to (${x}, ${y})`);
        try {
          onMove(item.id, x, y, page);
          console.log(`✅ Move operation completed successfully`);
        } catch (error) {
          console.error(`❌ Move operation failed:`, error);
        }
      } else {
        // It's a new item from ControlPalette
        console.log(`✨ CREATING new control: ${item.type} for ${item.recipient.name} at (${x}, ${y})`);
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
        console.log(`📝 New control object created:`, newDropped);
        try {
          onDrop(newDropped);
          console.log(`✅ Drop operation completed successfully`);
        } catch (error) {
          console.error(`❌ Drop operation failed:`, error);
        }
      }
      
      // Return result for React DnD
      console.log(`🎯 PAGEDROPZONE: DROP EVENT COMPLETED on page ${page} (IN DIALOG)`);
      return { success: true, page, position: { x, y } };
    },
  }));

  // Combined ref so we both retain the element & register it as a drop target *after* React assigns the DOM node
  // We'll create an internal overlay div (with pointer events) to attach the drop target.
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const setContainerNode = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      containerRef.current = node;
      // The overlay may not exist yet; attach once effect runs.
    }
  }, []);

  useEffect(() => {
    if (overlayRef.current) {
      drop(overlayRef.current);
      console.log(`🔗 PAGEDROPZONE: Drop target attached to overlay for page ${page}`);
    } else {
      console.log(`⏳ PAGEDROPZONE: Awaiting overlay ref for page ${page}`);
    }
  }, [drop, page]);

  console.log(`� PAGEDROPZONE: Render page ${page} (IN DIALOG), controls: ${controls.length}, isOver: ${isOver}`);

  // Add window-level drag detection
  React.useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      console.log(`🌍 WINDOW: Drag over detected globally on page ${page}`, { x: e.clientX, y: e.clientY });
    };
    
    const handleWindowDrop = (e: DragEvent) => {
      console.log(`🌍 WINDOW: Drop detected globally on page ${page}`, { x: e.clientX, y: e.clientY });
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [page]);

  return (
    <div
      ref={setContainerNode}
      id={`page-${page}`}
      className="pdf-page-dropzone"
      style={{
        position: "relative",
        marginBottom: "16px",
        display: "inline-block",
      }}
    >
      <canvas ref={canvasRef} />
      {/* Overlay that actually receives pointer events & hosts drop target */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          // Now non-interactive so placed controls underneath are draggable
          background: 'rgba(0,0,0,0)',
          pointerEvents: 'none'
        }}
      />
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
