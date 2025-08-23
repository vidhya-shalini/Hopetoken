import React, { useState } from "react";
import { ethers } from "ethers";

function DonateButton({ orphanageName }) {
  const [txStatus, setTxStatus] = useState("");

  const donate = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask first!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: "0xYourTestWalletAddressHere", // Replace with your orphanage or contract address
        value: ethers.parseEther("0.01"), // Sending 0.01 ETH
      });

      setTxStatus("Transaction sent, waiting for confirmation...");
      await tx.wait();
      setTxStatus("✅ Donation successful!");
    } catch (err) {
      console.error(err);
      setTxStatus("❌ Transaction failed!");
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={donate}
        className="bg-purple-600 text-white px-3 py-1 rounded"
      >
        Donate to {orphanageName}
      </button>
      {txStatus && <p className="mt-1 text-sm">{txStatus}</p>}
    </div>
  );
}

export default DonateButton;
