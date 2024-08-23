import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Draggable, DragArea } from './draggable.js';
import Content from "./content";
import ItemControls from './itemcontrols';
import updateSubmission from '../hooks/updatesubmission';
import setError from '../hooks/seterror';

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
    if (!privateID)
      return;
    const newContents = [...contents];
    const [removed] = newContents.splice(dragIndex, 1);
    newContents.splice(hoverIndex, 0, removed);
    setContents(newContents);
  };

  const handleDragStart = () => {
    if (!privateID)
      return;
    setPrevContents([...contents])
  };

  const handleDragEnd = async (id, dropIndex) => {
    try {
      if (!privateID)
        return;
      await updateSubmission({ contentID: id, order: prevContents[dropIndex].order })
      await router.replace(router.asPath, undefined, { scroll: false });
    } catch (error) {
      setError(error);
    }
  };

  return (
<DragArea>
  <div ref={containerRef} {...props}>
    <Grid columns={columns}>
      {contents.map((contentItem, index) => (
        <Draggable
          key={contentItem.id} 
          id={contentItem.id} 
          order={contentItem.order}
          index={index} 
          moveItem={moveItem}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {({ dragRef }) => (
            <div style={{
                position: 'relative',
                height: '250px',
                border: '1px solid #999999',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: 'black'
              }}>
              <Content 
                contentItem={contentItem}
                width="100%" 
                height="100%"
                index={index}
                caption
                thumbnail
                cover
              />
              {privateID && (
                <ItemControls 
                  contentItem={contentItem} 
                  dragRef={dragRef}
                />
              )}
            </div>
          )}
        </Draggable>
      ))}
    </Grid>
  </div>
</DragArea>
  );
}
