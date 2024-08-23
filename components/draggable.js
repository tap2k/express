import { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

const Backend = typeof window !== 'undefined' && 'ontouchstart' in window ? TouchBackend : HTML5Backend;

export function Draggable({ id, index, moveItem, onDragStart, onDragEnd, children }) {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [, drag, preview] = useDrag({
    type: 'ITEM',
    item: () => {
      setIsDragging(true);
      onDragStart(id, index);
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: async (item, monitor) => {
      setIsDragging(false);
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        await onDragEnd(item.id, item.index);
      }
    },
  });
  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) {
        return;
      }

      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.2s, transform 0.2s',
        boxShadow: isDragging ? '0 0 10px rgba(0, 0, 0, 0.3)' : 'none',
      }}
    >
      {children({ dragRef: drag })}
    </div>
  );
}

export function DragArea({ children }) {
  return <DndProvider backend={Backend}>{children}</DndProvider>;
}
