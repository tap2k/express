import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Draggable, DragArea } from './draggable.js';
import Masonry from 'react-masonry-css';
import updateSubmission from '../hooks/updatesubmission';
import setError from '../hooks/seterror';
import ContentCard from './contentcard';

export default function Board({ channel, privateID, jwt, ...props }) {
  const [contents, setContents] = useState(channel.contents);
  const [prevContents, setPrevContents] = useState([...channel.contents]);
  const router = useRouter();

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const updateContents = useCallback(() => {
    setContents(channel.contents);
    setPrevContents(channel.contents);
  }, [channel.contents]);

  useEffect(() => {
    updateContents();
  }, [router.asPath, updateContents]);

  const moveItem = (fromIndex, toIndex) => {
    if (!privateID && !jwt)
      return;
    setContents((previousContents) => {
      const updatedContents = [...previousContents];
      const [movedItem] = updatedContents.splice(fromIndex, 1);
      updatedContents.splice(toIndex, 0, movedItem);
      return updatedContents;
    });
  };

  const handleDragStart = () => {
    if (!privateID && !jwt)
      return;
    setPrevContents([...contents]);
  };

  const handleDragEnd = async (id, dropIndex) => {
    if (!privateID && !jwt)
      return;
    if (id == prevContents[dropIndex].id)
      return;
    try {
      await updateSubmission({ contentID: id, order: prevContents[dropIndex].order, privateID, jwt });
      router.replace(router.asPath, undefined, { scroll: false });
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
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
                  <div onDoubleClick={() => handleContentClick(contentItem)}>
                    <ContentCard contentItem={contentItem} privateID={privateID} jwt={jwt} dragRef={dragRef} controls tags />
                  </div>
                )}
              </Draggable>
            ))}
          </Masonry>
          <style jsx global>{`
            .my-masonry-grid {
              display: flex;
              width: auto;
            }
            .my-masonry-grid_column {
              padding-left: 10px;
              background-clip: padding-box;
            }
          `}</style>
        </div>
      </DragArea>
    </>
  );
}