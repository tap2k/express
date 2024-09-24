import { useState, useEffect, useRef } from 'react';
import Content from "./content";
import ItemControls from "./itemcontrols";
import ContentTagger from "./contenttagger";
import TagSearch from "./tagsearch";

const Grid = ({ children, columns }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '10px' }}>
    {children}
  </div>
);

export default function TagWall ({ channel, privateID, jwt, ...props }) {

  if (!channel)
    return;

  const [columns, setColumns] = useState(1);
  const [currTag, setCurrTag] = useState(null);
  const containerRef = useRef(null);

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

  return (
    <>
      { channel.tags?.length > 0 && <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 30
      }}>
        <TagSearch
          style={{
            minHeight: 30,
            width: '60%',
            backgroundColor: '#cccccc',
          }}
          channel={channel}
          currTag={currTag}
          setCurrTag={setCurrTag}
          combine
          privateID={privateID}
          jwt={jwt}
        />
      </div> }
      <div ref={containerRef} {...props}>
        <Grid columns={columns}>
        {channel.contents.map((contentItem, index) => {
        if (!currTag || contentItem.tags.some(tagItem => tagItem.id === currTag.id)) {
          return (
            <div key={index} style={{
              position: 'relative',
              border: '1px solid #999999',
              borderRadius: '10px',
              backgroundColor: '#dddddd'
            }}>
              <div style={{
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: 'black'
              }}>
                <Content 
                  contentItem={contentItem}
                  width="100%" 
                  height={400}
                  caption
                  thumbnail
                />
                <ItemControls 
                  contentItem={contentItem} 
                  privateID={privateID}
                  jwt={jwt}
                  publisher
                />
              </div>
              <ContentTagger 
                contentItem={contentItem}
                tags={channel.tags} 
                jwt={jwt} 
                privateID={privateID} 
                style={{width: '325px', marginTop: '10px', marginBottom: '10px'}} 
              />
            </div>
          );
        }
        return null;
      })}
        </Grid>
      </div>
    </>
  );
}
