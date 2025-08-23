import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DonationFeed() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("/api/donations");
        setDonations(response.data);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };

    fetchDonations();

    // Optionally, poll every 10 seconds to update feed
    const interval = setInterval(fetchDonations, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Donation Messages</h2>
      {donations.length === 0 && <p>No donations yet!</p>}
      {donations.map((d) => (
        <div key={d.id} className="mb-2 p-2 border rounded">
          <p><strong>Wallet:</strong> {d.wallet}</p>
          <p><strong>Amount:</strong> {d.amount} ETH</p>
          <p><strong>Message:</strong> {d.message}</p>
        </div>
      ))}
    </div>
  );
}

