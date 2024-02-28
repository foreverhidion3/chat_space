import React from 'react';
import banana_img_3 from '../images/banana_img_3.svg';
import './GO_BANANAS.css'

const GoBananas = ({ showClearButton, onGoBananasClick, onClearBananasClick }) => {
  const handleClick = () => {
    if (showClearButton) {
      onClearBananasClick();
    } else {
      onGoBananasClick();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className = 'banana_img_3_container'>
      <img
        id='banana_img_3'
        src={banana_img_3}
        alt={showClearButton ? 'Clear Bananas' : 'GO BANANAS!'}
        onClick={handleClick}
        // style={{ width: '100px', height: '100px', cursor: 'pointer' }}
      />
      </div>
    </div>
  );
};

export default GoBananas;