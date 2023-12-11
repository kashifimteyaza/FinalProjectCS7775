import React from 'react';

const Modal = ({ isOpen, onClose, stats }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>Stats</h2>
        <p>Message Changes: {stats.messageChanges}</p>
        <p>Proceed Counts: {stats.proceedCounts}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;