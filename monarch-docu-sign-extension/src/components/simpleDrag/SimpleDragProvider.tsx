import * as React from 'react';
import { IRecipient, Type, IDroppedControl } from '../common/Types';
import { useAppDispatch } from '../../store/hooks';
import { addControl } from '../../store/store';

export interface ISimpleDragPayload {
  type: Type;
  recipient: IRecipient;
  originX: number;
  originY: number;
  startedAt: number;
}

interface ISimpleDragContext {
  dragging: ISimpleDragPayload | null;
  startDrag: (p: Omit<ISimpleDragPayload, 'startedAt'>) => void;
  cancelDrag: () => void;
}

const SimpleDragContext = React.createContext<ISimpleDragContext | undefined>(undefined);

export const useSimpleDrag = () => {
  const ctx = React.useContext(SimpleDragContext);
  if (!ctx) throw new Error('useSimpleDrag must be used within SimpleDragProvider');
  return ctx;
};

function findPageElement(clientX: number, clientY: number): HTMLElement | null {
  const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
  if (!el) return null;
  if (el.id.startsWith('page-')) return el;
  return el.closest('[id^="page-"]') as HTMLElement | null;
}

const SimpleDragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dragging, setDragging] = React.useState<ISimpleDragPayload | null>(null);
  const dispatch = useAppDispatch();

  const startDrag = React.useCallback((p: Omit<ISimpleDragPayload, 'startedAt'>) => {
    // Seed ghost position immediately so user sees feedback even before first mousemove
    (window as any).lastDragX = p.originX + 12;
    (window as any).lastDragY = p.originY + 12;
  console.log('SIMPLE DRAG: startDrag called', p);
    setDragging({ ...p, startedAt: Date.now() });
  }, []);

  const cancelDrag = React.useCallback(() => setDragging(null), []);

  React.useEffect(() => {
    if (!dragging) return;

  console.log('SIMPLE DRAG: Effect mounted - attaching listeners');
    let moveCount = 0;

    const placeControl = (clientX: number, clientY: number, reason: string) => {
      const pageEl = findPageElement(clientX, clientY);
      if (pageEl) {
        const rect = pageEl.getBoundingClientRect();
        const pageNum = parseInt(pageEl.id.replace('page-', ''), 10);
        const x = clientX - rect.left - 60;
        const y = clientY - rect.top - 20;
        const newControl: IDroppedControl = {
          id: Date.now().toString(),
          recipient: dragging.recipient,
          type: dragging.type,
          x,
          y,
          page: pageNum,
          isRequired: dragging.type === 'SIGNATURE',
          isReadOnly: false,
          isFinalized: false,
        };
  console.log(`SIMPLE DRAG: Dropping control (${reason})`, newControl);
        dispatch(addControl(newControl));
      } else {
  console.log(`SIMPLE DRAG: No page under cursor on ${reason}`, { clientX, clientY });
      }
    };

    const handleMove = (e: MouseEvent) => {
      moveCount++;
      if (moveCount < 5 || moveCount % 10 === 0) {
  console.log('SIMPLE DRAG move', { x: e.clientX, y: e.clientY, moveCount });
      }
      (window as any).lastDragX = e.clientX + 12;
      (window as any).lastDragY = e.clientY + 12;
    };
    const handleUp = (e: MouseEvent) => {
  console.log('SIMPLE DRAG mouseup', { x: e.clientX, y: e.clientY });
      placeControl(e.clientX, e.clientY, 'mouseup');
      cleanup();
    };
    const handlePointerMove = (e: PointerEvent) => {
      (window as any).lastDragX = e.clientX + 12;
      (window as any).lastDragY = e.clientY + 12;
    };
    const handlePointerUp = (e: PointerEvent) => {
  console.log('SIMPLE DRAG pointerup', { x: e.clientX, y: e.clientY });
      placeControl(e.clientX, e.clientY, 'pointerup');
      cleanup();
    };
    const handleDocumentClick = (e: MouseEvent) => {
      if (!dragging) return;
  console.log('SIMPLE DRAG document click fallback', { x: e.clientX, y: e.clientY });
      placeControl(e.clientX, e.clientY, 'click-fallback');
      cleanup();
    };

    const cleanup = () => {
      setDragging(null);
      document.body.classList.remove('simple-drag-active');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('click', handleDocumentClick, true);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    // capture phase click fallback (helps if mouseup swallowed)
    document.addEventListener('click', handleDocumentClick, true);
    document.body.classList.add('simple-drag-active');

    // Expose debug helper
    (window as any).cancelSimpleDrag = () => {
  console.log('SIMPLE DRAG: cancelSimpleDrag invoked');
      cleanup();
    };

    return () => {
      cleanup();
    };
  }, [dragging, dispatch]);

  return (
    <SimpleDragContext.Provider value={{ dragging, startDrag, cancelDrag }}>
      {children}
      {dragging && (
        <div style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 99999 }}>
          <div
            style={{
              transform: `translate(${(window as any).lastDragX || 0}px, ${(window as any).lastDragY || 0}px)`,
              background: '#222',
              color: '#fff',
              padding: '4px 8px',
              border: '1px solid #fff',
              borderRadius: 4,
              fontSize: 12,
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
            }}
          >
            {dragging.type}
          </div>
        </div>
      )}
    </SimpleDragContext.Provider>
  );
};

export default SimpleDragProvider;
