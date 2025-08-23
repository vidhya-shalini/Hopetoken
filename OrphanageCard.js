import React, { useState } from 'react';
import DonateModal from './DonateModal';

export default function OrphanageCard({orphanage, onDonate}){
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <img src={orphanage.image} alt="o" />
      <h3>{orphanage.name}</h3>
      <p>{orphanage.description}</p>
      <p>Raised: ₹{orphanage.raised} / ₹{orphanage.goal}</p>
      <div className="card-actions">
        <button onClick={()=>setOpen(true)}>Donate</button>
      </div>
      {open && <DonateModal orphanage={orphanage} onClose={()=>setOpen(false)} onDonate={onDonate} />}
    </div>
  );
}
