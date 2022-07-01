import {createContext, useContext} from "react";
import React, {useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";
import {WaveModal} from './WaveModal'

const WaveContext = createContext({});

export const WaveProvider = ({children}) => {
  const contractABI = abi.abi;
  const contractAddress = "0xBf69e200a0DF586a9910Bd60a89ef56eDCA7301e";

  const [waveMessage, setWaveMessage] = useState("");
  const [showWaveDialog, setShowWaveDialog] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const waveTxn = await wavePortalContract.wave(
        waveMessage, { gasLimit: 300000 }
      );
      console.log("Mining...", waveTxn.hash);

      setLoading(true);
      
      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);
   
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    setShowWaveDialog(false);
          
  }

  const handleWaves = () => {
    return setShowWaveDialog(true);
  }

  return (
    <WaveContext.Provider
      value={{
        contractABI,
        contractAddress,
        handleWaves,
        loading
    }}>
      { showWaveDialog && (
        <WaveModal
          setWaveMessage={setWaveMessage}
          setShowWaveDialog={setShowWaveDialog}
          wave={wave}
          loading={loading}
        />
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