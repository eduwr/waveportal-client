import React from "react";
import {Loader} from './Loader'
import "./WaveModal.css";

export const WaveModal = ({
  setWaveMessage,
  setShowWaveDialog,
  wave,
  loading
}) => {
  return (
    <div className="modal-container">
      <div className="modal-card">
        {loading ? (
            <Loader />
          ) : (
          <>
            <h3>Hooray...</h3>
            <p>Send your wave message!</p>
          </>
          )}
        <input
          onChange={e => setWaveMessage(e.target.value)}
          disabled={loading}
          placeholder="Type a cool message..."
        />
        <div className="btn-wrapper">
          <button
            type="button"
            onClick={() => setShowWaveDialog(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={wave}  
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}