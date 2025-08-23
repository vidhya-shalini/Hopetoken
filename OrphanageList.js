import React from 'react';
import OrphanageCard from './OrphanageCard';
import DonateButton from './DonateButton';

export default function OrphanageList({ orphanages }) {
  return (
    <div className="grid gap-4">
      {orphanages.map((o) => (
        <OrphanageCard key={o.id} orphanage={o}>
          {/* Add the DonateButton inside each card */}
          <DonateButton orphanageName={o.name} />
        </OrphanageCard>
      ))}
    </div>
  );
}
