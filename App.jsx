import DonationFeed from "./DonationFeed";

function Home() {
  // existing code...

  return (
    <div>
      {/* existing donation component */}
      <Donate account={walletAddress} orphanageId={1} />
      
      {/* display messages */}
      <DonationFeed />
    </div>
  );
}
