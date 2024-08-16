import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { Alert, Container, Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Input } from 'reactstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { FaGripVertical, FaTrash, FaEdit } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Content from "./content";
import updateSubmission from '../hooks/updatesubmission';
import deleteSubmission from '../hooks/deletesubmission';
import setError from '../hooks/seterror';

const DragItem = ({ id, index, moveItem, onDragEnd, children }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        return;
      }
      onDragEnd();
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

  const handleDragEnd = async () => {
    try {
      const updates = contents.map((content, index) => 
        updateSubmission({ contentID: content.id, order: index })
      );
      await Promise.all(updates);
      await router.replace(router.asPath);
    } catch (error) {
      setError(error);
      setContents(channel.contents);
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
              await router.replace(router.asPath);
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
                  <div style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    display: 'flex',
                    gap: '10px',
                    zIndex: 1000
                  }}>
                    <button 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.5)', 
                        border: 'none', 
                        borderRadius: '50%', 
                        padding: '5px',
                        cursor: 'move'
                      }}
                    >
                      <FaGripVertical size={20} color="rgba(0, 0, 0, 0.5)" />
                    </button>
                    <button 
                      onClick={() => handleDelete(contentItem.id)} 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.7)', 
                        border: 'none', 
                        borderRadius: '50%', 
                        padding: '5px' 
                      }}
                    >
                      <FaTrash size={20} color="rgba(0, 0, 0, 0.5)" />
                    </button>
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
