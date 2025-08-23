function ConnectWallet({ account, setAccount }) {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected connection", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div>
      {account ? (
        <p>✅ Connected: {account}</p>
      ) : (
        <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default ConnectWallet;

