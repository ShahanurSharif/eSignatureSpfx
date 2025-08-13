import * as React from "react";
import { IDroppedItemProps, userColors } from "../common/Types";

const DroppedItem: React.FC<IDroppedItemProps> = ({
  id,
  recipient,
  type,
  x,
  y,
  isRequired,
  isFinalized,
  onDelete,
  toggleControlRequired,
  onMove,
}) => {
  const color = userColors[recipient.orderId] || {
    border: "#555",
    background: "#eee",
  };
  const [isDragging, setIsDragging] = React.useState(false);
  const [tempPos, setTempPos] = React.useState<{ x: number; y: number } | null>(null);
  const startPosRef = React.useRef<{mouseX: number; mouseY: number; origX: number; origY: number; page: number}>();
  const nodeRef = React.useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFinalized) return;
    e.preventDefault();
    // Identify page from ancestor id=page-N
    const pageEl = (e.currentTarget.closest('[id^="page-"]') as HTMLElement) || undefined;
    const page = pageEl ? parseInt(pageEl.id.replace('page-',''), 10) : 1;
    startPosRef.current = { mouseX: e.clientX, mouseY: e.clientY, origX: x, origY: y, page };
    setTempPos({ x, y });
    setIsDragging(true);
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
    (e.currentTarget as HTMLElement).addEventListener('pointermove', handlePointerMove as any);
    (e.currentTarget as HTMLElement).addEventListener('pointerup', handlePointerUp as any, { once: true });
    // Window fallback
    window.addEventListener('pointerup', handlePointerUp as any, { once: true });
    console.log('🟢 SIMPLE MOVE pointerdown', { id, x, y, page, pointerId: e.pointerId });
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!startPosRef.current) return;
    const { mouseX, mouseY, origX, origY } = startPosRef.current;
    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;
    const newX = origX + dx;
    const newY = origY + dy;
    setTempPos({ x: newX, y: newY });
    if (nodeRef.current) nodeRef.current.style.pointerEvents = 'none';
    if ((dx * dx + dy * dy) % 400 === 0) {
      console.log('🟡 SIMPLE MOVE pointermove', { id, newX, newY, dx, dy });
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!startPosRef.current) return cleanupDrag();
    const { mouseX, mouseY, origX, origY, page } = startPosRef.current;
    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;
  const newX = origX + dx;
  const newY = origY + dy;
    console.log('🔄 SIMPLE MOVE pointerup', { id, from: { x: origX, y: origY }, to: { x: newX, y: newY }, page });
    try {
      const targetPageEl = document.elementFromPoint(e.clientX, e.clientY)?.closest('[id^="page-"]');
      let targetPageNumber = page;
      if (targetPageEl) {
        const parsed = parseInt((targetPageEl as HTMLElement).id.replace('page-',''), 10);
        if (!isNaN(parsed)) targetPageNumber = parsed;
      }
      if (typeof onMove === 'function') {
    onMove(id, newX, newY, targetPageNumber);
    console.log('✅ SIMPLE MOVE committed', { id, newX, newY, targetPageNumber });
      }
    } catch (err) {
      console.warn('⚠️ SIMPLE MOVE: onMove failed or not wired', err);
    }
    cleanupDrag();
  };

  const cleanupDrag = () => {
    setIsDragging(false);
    setTempPos(null);
    if (nodeRef.current) {
      nodeRef.current.style.pointerEvents = '';
    }
    try { nodeRef.current?.releasePointerCapture?.((startPosRef.current as any)?.pointerId); } catch {}
    nodeRef.current?.removeEventListener('pointermove', handlePointerMove as any);
    nodeRef.current?.removeEventListener('pointerup', handlePointerUp as any);
    window.removeEventListener('pointerup', handlePointerUp as any);
    startPosRef.current = undefined;
  };

  React.useEffect(() => () => cleanupDrag(), []);

  const posX = tempPos ? tempPos.x : x;
  const posY = tempPos ? tempPos.y : y;

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: posX,
    top: posY,
    padding: "4px 8px",
    backgroundColor: color.background,
    border: `2px solid ${color.border}`,
    color: color.border,
    opacity: isDragging ? 0.5 : 1,
    borderRadius: 6,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "20px",
    width: "150px",
  cursor: isFinalized ? "default" : "move",
  zIndex: 5,
  };

  const closeStyle: React.CSSProperties = {
    marginLeft: 8,
    color: "#888",
    cursor: "pointer",
    fontWeight: "normal",
  };

  return (
    <div
      ref={nodeRef}
      style={containerStyle}
      onPointerDown={handlePointerDown}
      data-control-id={id}
    >
      <label>
        {type}
        {isRequired && <span style={{ color: "red", marginLeft: 2 }}>*</span>}
      </label>

      {/* Show toggle and delete when not finalized */}
      {!isFinalized && (
        <div style={{ display: "flex", alignItems: "center" }}>
          {toggleControlRequired && (
            <span
              style={{
                marginRight: 4,
                color: "#666",
                cursor: "pointer",
                fontSize: "12px",
              }}
              onClick={() => toggleControlRequired(id)}
              title={isRequired ? "Mark as Optional" : "Mark as Required"}
            >
              {isRequired ? "Req" : "Opt"}
            </span>
          )}
          <span style={closeStyle} onClick={() => onDelete(id)}>
            ✖
          </span>
        </div>
      )}

      {/* Show lock icon when finalized */}
      {isFinalized && (
        <span
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            background: "#fff",
            borderRadius: "50%",
            padding: "2px",
            fontSize: 12,
            color: "#888",
            boxShadow: "0 0 3px rgba(0,0,0,0.2)",
          }}
          title="Locked"
        >
          🔒
        </span>
      )}
    </div>
  );
};

export default DroppedItem;
