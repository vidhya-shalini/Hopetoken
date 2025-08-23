import React, { useState } from 'react';

export default function DonateModal({orphanage, onClose, onDonate}){
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(500);

  const submit = ()=>{
    onDonate({ orphanageId: orphanage.id, name, amount });
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Donate to {orphanage.name}</h3>
        <label>Your name</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
        <label>Amount (₹)</label>
        <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
        <div className="modal-actions">
          <button onClick={submit}>Donate (Mock)</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
