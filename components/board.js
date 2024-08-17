import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Card } from 'reactstrap';
import Masonry from 'react-masonry-css';
import Content from './content';
import Caption from './caption';
import { FaGripVertical, FaTrash } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import updateSubmission from '../hooks/updatesubmission';
import deleteSubmission from '../hooks/deletesubmission';
import setError from '../hooks/seterror';

const DraggableItem = ({ id, index, moveItem, onDragStart, onDragEnd, children }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: () => {
      onDragStart();
      return { id, index };
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        onDragEnd(item.id, item.index);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
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

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
};

export default function Board({ channel, privateID, ...props }) {
  const [contents, setContents] = useState(channel.contents);
  const [prevContents, setPrevContents] = useState([...channel.contents]);
  const router = useRouter();

  const updateContents = useCallback(() => {
    setContents(channel.contents);
    setPrevContents(channel.contents);
  }, [channel.contents]);

  useEffect(() => {
    updateContents();
  }, [router.asPath, updateContents]);

  const moveItem = (fromIndex, toIndex) => {
    setContents((previousContents) => {
      const updatedContents = [...previousContents];
      const [movedItem] = updatedContents.splice(fromIndex, 1);
      updatedContents.splice(toIndex, 0, movedItem);
      return updatedContents;
    });
  };

  const handleDragStart = () => {
    setPrevContents([...contents]);
  };

  const handleDragEnd = async (id, dropIndex) => {
    try {
      await updateSubmission({ contentID: id, order: prevContents[dropIndex].order });
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

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const Backend = typeof window !== 'undefined' && 'ontouchstart' in window ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={Backend}>
      <div {...props}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {contents.map((contentItem, index) => (
            <DraggableItem
              key={contentItem.id}
              id={contentItem.id}
              index={index}
              moveItem={moveItem}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <Card className="mb-1">
                <div style={{ position: 'relative' }}>
                  <Content 
                    itemUrl={contentItem.mediafile?.url}
                    audioUrl={contentItem.audiofile?.url}
                    width="100%" 
                    height="auto"
                    cover
                    index={index}
                  />
                  {privateID && (
                    <div style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      display: 'flex',
                      gap: '5px',
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
                <Caption 
                  title={contentItem.description}
                  textAlignment={contentItem.textAlignment} 
                />
              </Card>
            </DraggableItem>
          ))}
        </Masonry>
        <style jsx global>{`
          .my-masonry-grid {
            display: flex;
            width: auto;
          }
          .my-masonry-grid_column {
            padding-left: 5px;
            background-clip: padding-box;
          }
        `}</style>
      </div>
    </DndProvider>
  );
}
