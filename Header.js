import React from 'react';
export default function Header({insights}){
  return (
    <header className="header">
      <h1>HopeToken</h1>
      <div className="header-meta">
        {insights ? (
          <div>
            <strong>Top need:</strong> {insights.top_need.name} needs ₹{insights.top_need.shortfall}
          </div>
        ) : (<div>Loading insights…</div>)}
      </div>
    </header>
  );
}
