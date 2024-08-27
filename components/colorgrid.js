import { colorOptions } from './fileoptions';

export default function ColorGrid({ selectedColor, setSelectedColor }) {
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
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
      {colorOptions.map((color, index) => (
        <div
          key={index}
          style={{
            ...itemStyle,
            backgroundColor: color[1],
          }}
          onClick={() => setSelectedColor(color)}
        >
          {selectedColor === color && (
            <div style={selectedOverlayStyle}>✓</div>
          )}
        </div>
      ))}
    </div>
  );
}