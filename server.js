let donationRecords = [];

app.post("/api/donate", (req, res) => {
  const { orphanageId, wallet, amount, message } = req.body;
  const orphanageName = orphanages.find(o => o.id === orphanageId)?.name || "Unknown";
  donationRecords.push({
    orphanageId,
    orphanageName,
    wallet,
    amount,
    message: message || "",
    timestamp: Date.now(),
  });
  res.json({ success: true });
});

app.get("/api/donations", (req, res) => {
  res.json(donationRecords.reverse()); // latest first
});
