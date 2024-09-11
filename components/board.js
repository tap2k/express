import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import Masonry from 'react-masonry-css';
import { Draggable, DragArea } from './draggable.js';
import updateSubmission from '../hooks/updatesubmission';
import setError from '../hooks/seterror';
import ContentCard from './contentcard';

export default function Board({ channel, privateID, jwt, ...props }) {
  const [contents, setContents] = useState(channel.contents);
  const [prevContents, setPrevContents] = useState([...channel.contents]);
  const [zoomedCardId, setZoomedCardId] = useState(null);
  const [zoomedCardPosition, setZoomedCardPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const router = useRouter();

  const updateContents = useCallback(() => {
    setContents(channel.contents);
    setPrevContents(channel.contents);
  }, [channel.contents]);

  useEffect(() => {
    updateContents();
  }, [router.asPath, updateContents]);

  const moveItem = (fromIndex, toIndex) => {
    if (!privateID && !jwt) return;
    setContents((previousContents) => {
      const updatedContents = [...previousContents];
      const [movedItem] = updatedContents.splice(fromIndex, 1);
      updatedContents.splice(toIndex, 0, movedItem);
      return updatedContents;
    });
  };

  const handleDragStart = () => {
    if (!privateID && !jwt) return;
    setPrevContents([...contents]);
  };

  const handleDragEnd = async (id, dropIndex) => {
    if (!privateID && !jwt) return;
    if (id == prevContents[dropIndex].id) return;
    try {
      await updateSubmission({ contentID: id, order: prevContents[dropIndex].order, privateID, jwt });
      router.replace(router.asPath, undefined, { scroll: false });
    } catch (error) {
      setError(error);
    }
  };

  const handleCardClick = (contentId, event) => {
    if (contentId === zoomedCardId) {
      setZoomedCardId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setZoomedCardPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      setZoomedCardId(contentId);
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const zoomedCard = contents.find(item => item.id === zoomedCardId);

  return (
    <DragArea>
      <div {...props}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {contents.map((contentItem, index) => (
            <Draggable
              key={contentItem.id}
              id={contentItem.id}
              index={index}
              moveItem={moveItem}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {({ dragRef }) => (
                <div 
                  onDoubleClick={(e) => handleCardClick(contentItem.id, e)}
                  className="content-card-wrapper"
                >
                  <ContentCard contentItem={contentItem} privateID={privateID} jwt={jwt} dragRef={dragRef} />
                </div>
              )}
            </Draggable>
          ))}
        </Masonry>
        {zoomedCard && createPortal(
          <div 
            className="zoomed-card-overlay"
            onClick={() => setZoomedCardId(null)}
          >
            <div 
              className="zoomed-card-content"
              style={{
                position: 'absolute',
                top: `${zoomedCardPosition.top}px`,
                left: `${zoomedCardPosition.left}px`,
                width: `${zoomedCardPosition.width}px`,
                height: `${zoomedCardPosition.height}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ContentCard contentItem={zoomedCard} privateID={privateID} jwt={jwt} />
            </div>
          </div>,
          document.body
        )}
        <style jsx global>{`
          .my-masonry-grid {
            display: flex;
            width: auto;
            margin-left: -10px;
          }
          .my-masonry-grid_column {
            padding-left: 10px;
            background-clip: padding-box;
          }
          .content-card-wrapper {
            margin-bottom: 10px;
          }
          .zoomed-card-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          .zoomed-card-content {
            transition: all 0.3s ease-in-out;
            transform: scale(1.5);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>
    </DragArea>
  );
}