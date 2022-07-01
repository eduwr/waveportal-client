import React from "react";
import "./WaveModal.css";

export const WaveModal = ({
  setWaveMessage,
  setShowWaveDialog,
  wave
}) => {
  return (
    <div className="modal-container">
      <div className="modal-card">
        <h3>Hooray...</h3>
        <p>Send your wave message!</p>
        <input
          onChange={e => setWaveMessage(e.target.value)}
        />
        <div className="btn-wrapper">
          <button
            type="button"
            onClick={() => setShowWaveDialog(false)}  
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={wave}  
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}