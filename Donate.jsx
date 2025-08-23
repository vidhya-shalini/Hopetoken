import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";

function Donate({ orphanageId }) {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [status, setStatus] = useState("");
  const [donationFeed, setDonationFeed] = useState([]);

  // Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert("MetaMask not installed!");
    }
  };

  // Handle Donation
  const handleDonate = async () => {
    if (!account) {
      alert("Connect Wallet First!");
      return;
    }

    try {
      // Blockchain transaction (simulation)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await signer.sendTransaction({
        to: "0x1234567890abcdef1234567890abcdef12345678", // Orphanage wallet
        value: ethers.parseEther(amount || "0.01"),
      });

      // Backend API call
      const response = await axios.post("/api/donate", {
        orphanageId,
        wallet: account,
        amount,
        message: donationMessage,
      });

      // Update local donation feed
      const newDonation = {
        wallet: account,
        amount,
        message: donationMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setDonationFeed([newDonation, ...donationFeed]);

      setStatus(`✅ You donated ${amount} ETH! Message: "${donationMessage}"`);
      setAmount("");
      setDonationMessage("");
    } catch (err) {
      console.error("Donation failed:", err);
      setStatus("❌ Donation failed!");
    }
  };

  return (
    <div className="p-6 border rounded shadow-md max-w-md mx-auto">
      {/* Connect Wallet */}
      <button
        onClick={connectWallet}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        {account ? `Connected: ${account}` : "Connect Wallet"}
      </button>

      {/* Donation Inputs */}
      <div className="mb-4">
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="text"
          placeholder="Message (e.g., For Education)"
          value={donationMessage}
          onChange={(e) => setDonationMessage(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={handleDonate}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Donate
        </button>
      </div>

      {/* Status Message */}
      {status && <p className="mb-4 text-green-600">{status}</p>}

      {/* Donation Feed */}
      <div className="border-t pt-4">
        <h2 className="font-bold mb-2">Donation Feed</h2>
        {donationFeed.length === 0 && <p>No donations yet.</p>}
        {donationFeed.map((d, index) => (
          <div
            key={index}
            className="p-2 mb-2 border rounded bg-gray-50"
          >
            <p>
              <strong>{d.wallet.slice(0, 6)}...{d.wallet.slice(-4)}</strong> donated {d.amount} ETH
            </p>
            <p>Message: {d.message}</p>
            <p className="text-xs text-gray-500">{d.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Donate;
