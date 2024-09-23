import React from 'react';

const Tooltip = ({ text, position }) => {
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '5px',
        zIndex: '1000',
        top: position.y,
        left: position.x,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

export default Tooltip;
