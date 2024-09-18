import React from 'react';
import { colorOptions } from './fileoptions';

export default function ColorGrid({ 
  selectedBackgroundColor, 
  setSelectedBackgroundColor, 
  selectedForegroundColor, 
  setSelectedForegroundColor 
}) {
  const columns = 4;

  const colorGridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridAutoRows: 'min-content',
    gap: '10px',
    marginTop: '5px',
    marginBottom: '5px',
    width: '100%',
    alignContent: 'start',
  };

  const itemStyle = {
    position: 'relative',
    aspectRatio: '1',
    overflow: 'hidden',
    borderRadius: '8px',
    cursor: 'pointer',
    height: '80px',
    width: '100%',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
  };

  const colorHalfStyle = {
    width: '50%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const selectedOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
  };

  return (
    <div style={colorGridStyle}>
      {/* None option */}
      <div
        style={{
          ...itemStyle,
          boxShadow: (selectedForegroundColor === '' && selectedBackgroundColor === '') 
            ? '0 0 0 3px #007bff' 
            : 'none'
        }}
        onClick={() => {
          setSelectedForegroundColor('');
          setSelectedBackgroundColor('');
        }}
      >
        <div style={{...colorHalfStyle, backgroundColor: 'white'}}>
          None
        </div>
        {(selectedForegroundColor === '' && selectedBackgroundColor === '') && (
          <div style={selectedOverlayStyle}>✓</div>
        )}
      </div>

      {/* Color options */}
      {colorOptions.map(([foreground, background], index) => (
        <div
          key={index}
          style={{
            ...itemStyle,
            boxShadow: (selectedForegroundColor === foreground && selectedBackgroundColor === background) 
              ? '0 0 0 3px #007bff' 
              : 'none'
          }}
          onClick={() => {
            setSelectedForegroundColor(foreground);
            setSelectedBackgroundColor(background);
          }}
        >
          <div style={{...colorHalfStyle, backgroundColor: foreground}}>
          </div>
          <div style={{...colorHalfStyle, backgroundColor: background}}>
          </div>
          {(selectedForegroundColor === foreground && selectedBackgroundColor === background) && (
            <div style={selectedOverlayStyle}>✓</div>
          )}
        </div>
      ))}
    </div>
  );
}