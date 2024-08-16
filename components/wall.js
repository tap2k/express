import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { Alert, Container } from 'reactstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { FaGripVertical } from 'react-icons/fa';
import Content from './content';
import updateSubmission from '../hooks/updatesubmission';
import setError from '../hooks/seterror';

const DragItem = ({ id, index, moveItem, handleDragEnd, children }) => {
  const ref = useRef(null);
  const [, drag] = useDrag({
    type: 'ITEM',
    item: { id, index },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        handleDragEnd(item.id, dropResult.index);
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
    drop: () => ({ index }),
  });

  drag(drop(ref));

  return <div ref={ref}>{children}</div>;
};

const Grid = ({ children, columns }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '10px' }}>
    {children}
  </div>
);

export default function Wall ({ channel, style, width, privateID }) {
  const [contents, setContents] = useState(channel.contents);
  const [columns, setColumns] = useState(1);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    updateColumns();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateColumns);
    }
    return () => {
      window.removeEventListener('resize', updateColumns);
    };
  }, []);

  const updateColumns = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth >= 1200) setColumns(4);
      else if (containerWidth >= 996) setColumns(3);
      else if (containerWidth >= 768) setColumns(2);
      else setColumns(1);
    }
  };

  const moveItem = (dragIndex, hoverIndex) => {
    setContents((prevContents) => {
      const newContents = [...prevContents];
      const [removed] = newContents.splice(dragIndex, 1);
      newContents.splice(hoverIndex, 0, removed);
      return newContents;
    });
  };

  const handleDragEnd = async (id, newIndex) => {
    try {
      await updateSubmission({ contentID: id, order: newIndex });
      await router.replace(router.asPath);
    } catch (error) {
      setError(error);
      // Revert the state if the update fails
      setContents(channel.contents);
    }
  };

  const Backend = typeof window !== 'undefined' && 'ontouchstart' in window ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={Backend}>
      <div ref={containerRef} style={{ ...style, width: width || '100%' }}>
        <Alert color="light" className="mb-2 py-4">
          <Container className="text-center">
            <h1>{channel.name}</h1>
            {channel.description && <h3>{channel.description}</h3>}
          </Container>
        </Alert>
        <Grid columns={columns}>
          {contents.map((contentItem, index) => (
            <DragItem 
              key={contentItem.id} 
              id={contentItem.id} 
              index={index} 
              moveItem={moveItem}
              handleDragEnd={handleDragEnd}
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
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 5, 
                      right: 5, 
                      cursor: 'move',
                      background: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '50%',
                      padding: 5,
                      zIndex: 1000
                    }}
                  >
                    <FaGripVertical size={20} color="rgba(0, 0, 0, 0.5)" />
                  </div>
                )}
              </div>
            </DragItem>
          ))}
        </Grid>
      </div>
    </DndProvider>
  );
}
