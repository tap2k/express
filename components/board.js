import { useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { FaGripVertical } from 'react-icons/fa';
import Content from './content';
import 'react-grid-layout/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Wall({ channel, style, width, privateID }) {
  const [myChannel, setMyChannel] = useState(channel);
  const [layouts, setLayouts] = useState(getInitialLayouts());
  const [key, setKey] = useState(0);

  function getInitialLayouts() {
    if (!myChannel?.contents) return {};

    const breakpoints = [
      { name: 'lg', cols: 4 },
      { name: 'md', cols: 3 },
      { name: 'sm', cols: 2 },
      { name: 'xs', cols: 1 },
    ];

    return breakpoints.reduce((layouts, { name, cols }) => {
      layouts[name] = myChannel.contents.map((_, index) => ({
        i: index.toString(),
        x: index % cols,
        y: Math.floor(index / cols),
        w: 1,
        h: 1,
      }));
      return layouts;
    }, {});
  }

  const onLayoutChange = (layout, layouts) => {
    const currentBreakpoint = layouts.lg ? 'lg' : layouts.md ? 'md' : layouts.sm ? 'sm' : 'xs';
    const cols = { lg: 4, md: 3, sm: 2, xs: 1 }[currentBreakpoint];

    const sortedLayout = layout.sort((a, b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    });

    const newLayout = sortedLayout.map((item, index) => ({
      ...item,
      x: index % cols,
      y: Math.floor(index / cols),
    }));

    setLayouts({ ...layouts, [currentBreakpoint]: newLayout });
  };

  const updateOrder = async (sourceIndex, targetIndex) => {
    const newContents = [...myChannel.contents];
    const [movedItem] = newContents.splice(sourceIndex, 1);
    newContents.splice(targetIndex, 0, movedItem);

    const updatedChannel = {
      ...myChannel,
      contents: newContents
    };

    try {
      const response = await fetch('/api/updateContentOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedChannel }),
      });
      if (response.ok) {
        setMyChannel(updatedChannel);
        setLayouts(getInitialLayouts(updatedChannel));
        setKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error('Failed to update content order:', error);
    }
  };

  const onDragStop = (layout, oldItem, newItem) => {
    const sourceIndex = parseInt(oldItem.i);
    const targetIndex = parseInt(newItem.i);

    if (sourceIndex !== targetIndex) {
      //updateOrder(sourceIndex, targetIndex);
    }
  };

  if (!myChannel || !myChannel.contents) return null;

  return (
    <div style={{ ...style, width }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
        padding: 30
      }}>
        <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>{myChannel.name}</h1>
        {myChannel.description && <h2 style={{ fontSize: '1.5em', fontWeight: 'normal' }}>{myChannel.description}</h2>}
      </div>
      <ResponsiveGridLayout
        key={key}
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 4, md: 3, sm: 2, xs: 1 }}
        rowHeight={250}
        isDraggable={privateID ? true : false}
        isResizable={false}
        onLayoutChange={onLayoutChange}
        onDragStop={onDragStop}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={false}
        margin={[10, 10]}
      >
        {myChannel.contents.map((contentItem, index) => (
          <div key={index} style={{ position: 'relative' }}>
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
                className="drag-handle" 
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
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
