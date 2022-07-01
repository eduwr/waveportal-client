import {createContext, useContext} from "react";
import React, {useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";


const WaveContext = createContext({});

export const WaveProvider = ({children}) => {
  const contractABI = abi.abi;
  const contractAddress = "0xe0DD3f25fb0BBB48cCE245219E595f6260F0A10D";

  const [waveMessage, setWaveMessage] = useState("");
  const [showWaveDialog, setShowWaveDialog] = useState(false);


  const wave = async () => {
    try {
      const { ethereum } = window;

      if(!ethereum) {
        console.log("Ethereum object doesn't exist!");
        return;
      }
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      /*
      * Execute the actual wave from your smart contract
      */
      const waveTxn = await wavePortalContract.wave(waveMessage);
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);
   
    } catch (error) {
      console.log(error);
    }
  }

  const handleWaves = () => {
    console.log("HANDLING WAVES")
    return setShowWaveDialog(true);
  }

  return (
    <WaveContext.Provider
      value={{
        contractABI,
        contractAddress,
        handleWaves
    }}>
      { showWaveDialog && (
        <div>
          <input
            onChange={e => setWaveMessage(e.target.value)}
          />
          <button
            type="button"
            onClick={e => setShowWaveDialog(false)}  
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
        )
      }
      {children}
    </WaveContext.Provider>
  )
}

export const useWave = () => {
  const context = useContext(WaveContext);

  if(!context) {
    throw new Error("useWave must be within a WaveProvider!")
  }

  return context;
}