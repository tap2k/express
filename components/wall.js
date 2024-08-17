import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Content from "./content";
import ItemControls from './itemcontrols';
import updateSubmission from '../hooks/updatesubmission';
import deleteSubmission from '../hooks/deletesubmission';
import setError from '../hooks/seterror';

const DragItem = ({ id, index, moveItem, onDragStart, onDragEnd, children }) => {
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


const Grid = ({ children, columns }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '10px' }}>
    {children}
  </div>
);

export default function Wall ({ channel, privateID, ...props }) {
  const [contents, setContents] = useState(channel.contents);
  const [prevContents, setPrevContents] = useState(channel.contents);
  const [columns, setColumns] = useState(1);
  const containerRef = useRef(null);
  const router = useRouter();

  const updateContents = useCallback(() => {
    setContents(channel.contents);
    setPrevContents(channel.contents);
  }, [channel.contents]);

  useEffect(() => {
    updateContents();
  }, [router.asPath, updateContents]);

  const updateColumns = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth >= 1200) setColumns(4);
      else if (containerWidth >= 996) setColumns(3);
      else if (containerWidth >= 768) setColumns(2);
      else setColumns(1);
    }
  };

  useEffect(() => {
    updateColumns();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateColumns);
    }
    return () => {
      window.removeEventListener('resize', updateColumns);
    };
  }, []);

  const moveItem = (dragIndex, hoverIndex) => {
    const newContents = [...contents];
    const [removed] = newContents.splice(dragIndex, 1);
    newContents.splice(hoverIndex, 0, removed);
    setContents(newContents);
  };

  const handleDragStart = () => {
    setPrevContents([...contents])
  };

  const handleDragEnd = async (id, dropIndex) => {
    try {
      await updateSubmission({ contentID: id, order: prevContents[dropIndex].order })
      await router.replace(router.asPath, undefined, { scroll: false });
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Delete item?',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteSubmission({contentID: id});
              setContents(contents.filter(content => content.id !== id));
              await router.replace(router.asPath, undefined, { scroll: false });
            } catch (error) {
              setError(error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const Backend = typeof window !== 'undefined' && 'ontouchstart' in window ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={Backend}>
      <div ref={containerRef} {...props}>
        <Grid columns={columns}>
          {contents.map((contentItem, index) => (
            <DragItem 
              key={contentItem.id} 
              id={contentItem.id} 
              order={contentItem.order}
              index={index} 
              moveItem={moveItem}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div style={{ position: 'relative', height: '250px' }}>
                <Content 
                  itemUrl={contentItem.mediafile?.url}
                  audioUrl={contentItem.audiofile?.url}
                  width="100%" 
                  height="100%"
                  cover
                  index={index}
                />
                {privateID && (
                  <ItemControls 
                    onDelete={handleDelete} 
                    contentID={contentItem.id} 
                  />
                )}
              </div>
            </DragItem>
          ))}
        </Grid>
      </div>
    </DndProvider>
  );
}
