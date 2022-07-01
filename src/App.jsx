import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import {WaveProvider, useWave} from './WaveContext';




function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves , setAllWaves] = useState([]);
 
  const {contractAddress, contractABI, handleWaves } = useWave()

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      }
      
      console.log("We have the ethereum object", ethereum);
      

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        getAllWaves()
        return;
      }
      
      console.log("No authorized account found")
    
    } catch (error) {
      console.log(error);
    }

  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
 
  useEffect(() => {
      checkIfWalletIsConnected();
  }, [])

  return (

      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
          👋 Hello!
          </div>
  
          <div className="bio">
          I am Eduardo and I worked on chemistry labs so that's pretty cool right? Connect your Ethereum wallet and wave at me!
          </div>
  
          <button className="waveButton" onClick={handleWaves}>
            Wave at Me
          </button>
          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
             Connect Wallet
            </button>)
          }
  
           {allWaves.map((wave, index) => {
            return (
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>)
          })}
        </div>
 
      </div>
 
  );
}

export default function Wrapper() {
  return (
    <WaveProvider>
      <App />
    </WaveProvider>
  )
}
