import React from 'react';
import { backgroundColorOptions, overlayColorOptions } from './fileoptions';

export default function ColorGrid({
  selectedBackgroundColor,
  setSelectedBackgroundColor,
  selectedForegroundColor,
  setSelectedForegroundColor,
  hasImage,
  compact,
  showBox
}) {
  const columns = 4;
  const maxOptions = compact ? 6 : undefined;

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
    overflow: 'hidden',
    borderRadius: '8px',
    cursor: 'pointer',
    height: '50px',
    width: '100%',
    border: '1px solid #ccc',
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
    pointerEvents: 'none',
  };

  const customSwatchStyle = {
    ...itemStyle,
    overflow: 'visible',
    background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
  };

  const pickerInputStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  };

  const isCustomBackground = selectedBackgroundColor && selectedBackgroundColor !== '' && !backgroundColorOptions.includes(selectedBackgroundColor);
  const isCustomForeground = selectedForegroundColor && selectedForegroundColor !== '' && !overlayColorOptions.includes(selectedForegroundColor);

  const previewBg = selectedBackgroundColor || 'white';
  const previewFg = selectedForegroundColor || '#E6F0FF99';
  const previewFgHex = (selectedForegroundColor || '#E6F0FF').replace('#', '').substring(0, 6);
  const previewBgHex = (selectedBackgroundColor || '#FFFFFF').replace('#', '').substring(0, 6);
  const previewFgLight = previewFgHex.length === 6 && (parseInt(previewFgHex.substr(0,2),16)*299 + parseInt(previewFgHex.substr(2,2),16)*587 + parseInt(previewFgHex.substr(4,2),16)*114) / 1000 > 128;
  const previewBgLight = (parseInt(previewBgHex.substr(0,2),16)*299 + parseInt(previewBgHex.substr(2,2),16)*587 + parseInt(previewBgHex.substr(4,2),16)*114) / 1000 > 128;
  const fgAsTextColor = selectedForegroundColor ? '#' + selectedForegroundColor.replace('#', '').substring(0, 6) : null;
  const previewTextColor = (hasImage || showBox)
    ? (previewFgLight ? '#0a4f6a' : '#fff')
    : (fgAsTextColor || (previewBgLight ? '#0a4f6a' : '#fff'));

  return (
    <div>
      {setSelectedBackgroundColor && <>
        <div style={colorGridStyle}>
          <div
            style={{
              ...itemStyle,
              backgroundColor: 'white',
              boxShadow: selectedBackgroundColor === '' ? '0 0 0 3px #007bff' : 'none'
            }}
            onClick={() => setSelectedBackgroundColor('')}
          >
            None
            {selectedBackgroundColor === '' && <div style={selectedOverlayStyle}>✓</div>}
          </div>
          {(maxOptions ? backgroundColorOptions.slice(0, maxOptions) : backgroundColorOptions).map((color, index) => (
            <div
              key={index}
              style={{
                ...itemStyle,
                backgroundColor: color,
                boxShadow: selectedBackgroundColor === color ? '0 0 0 3px #007bff' : 'none'
              }}
              onClick={() => setSelectedBackgroundColor(color)}
            >
              {selectedBackgroundColor === color && <div style={selectedOverlayStyle}>✓</div>}
            </div>
          ))}
          <div
            style={{
              ...customSwatchStyle,
              boxShadow: isCustomBackground ? '0 0 0 3px #007bff' : 'none'
            }}
          >
            <input
              type="color"
              value={(selectedBackgroundColor || '#000000').substring(0, 7)}
              onChange={(e) => setSelectedBackgroundColor(e.target.value)}
              style={pickerInputStyle}
              title="Custom background color"
            />
            {isCustomBackground
              ? <div style={selectedOverlayStyle}>✓</div>
              : <span style={{ fontSize: '0.7rem', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.8)', pointerEvents: 'none' }}>Custom</span>
            }
          </div>
        </div>
      </>}

      {setSelectedBackgroundColor && setSelectedForegroundColor && (
        <div style={{
          background: hasImage
            ? 'linear-gradient(135deg, #667eea, #764ba2)'
            : previewBg,
          borderRadius: '8px',
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          minHeight: '60px',
        }}>
          {(hasImage || showBox) ? (
            <div style={{
              backgroundColor: previewFg,
              borderRadius: '8px',
              padding: '8px 24px',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              color: previewTextColor,
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}>
              Sample Title
            </div>
          ) : (
            <div style={{
              color: previewTextColor,
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}>
              Sample Title
            </div>
          )}
        </div>
      )}

      {setSelectedForegroundColor && <>
        <div style={colorGridStyle}>
          <div
            style={{
              ...itemStyle,
              backgroundColor: 'white',
              boxShadow: selectedForegroundColor === '' ? '0 0 0 3px #007bff' : 'none'
            }}
            onClick={() => setSelectedForegroundColor('')}
          >
            Default
            {selectedForegroundColor === '' && <div style={selectedOverlayStyle}>✓</div>}
          </div>
          {(maxOptions ? overlayColorOptions.slice(0, maxOptions) : overlayColorOptions).map((color, index) => (
            <div
              key={index}
              style={{
                ...itemStyle,
                backgroundColor: color,
                boxShadow: selectedForegroundColor === color ? '0 0 0 3px #007bff' : 'none'
              }}
              onClick={() => setSelectedForegroundColor(color)}
            >
              {selectedForegroundColor === color && <div style={selectedOverlayStyle}>✓</div>}
            </div>
          ))}
          <div
            style={{
              ...customSwatchStyle,
              boxShadow: isCustomForeground ? '0 0 0 3px #007bff' : 'none'
            }}
          >
            <input
              type="color"
              value={(selectedForegroundColor || '#ffffff').substring(0, 7)}
              onChange={(e) => setSelectedForegroundColor(e.target.value)}
              style={pickerInputStyle}
              title="Custom text color"
            />
            {isCustomForeground
              ? <div style={selectedOverlayStyle}>✓</div>
              : <span style={{ fontSize: '0.7rem', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.8)', pointerEvents: 'none' }}>Custom</span>
            }
          </div>
        </div>
      </>}
    </div>
  );
}
