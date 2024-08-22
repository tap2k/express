import { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

const Backend = typeof window !== 'undefined' && 'ontouchstart' in window ? TouchBackend : HTML5Backend;

export function Draggable({ id, index, moveItem, onDragStart, onDragEnd, children }) 
{
  const ref = useRef(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: () => {
      onDragStart(id, index);
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: async (item, monitor) => {
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
      item.index = hoverIndex;
    },
    drop: (item) => ({ id, index: item.index }),
  });

  drag(drop(ref));

  return <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>{children}</div>;
};

export function DragArea({ children }) 
{

  return (
    <DndProvider backend={Backend}>
      {children}
    </DndProvider>
  )
}