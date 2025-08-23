import React from "react";
import Donate from "./Donate";

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">HopeToken Dashboard</h1>
      <h2 className="text-xl mb-2">Welcome to the HopeToken Platform!</h2>

      {/* Each orphanage can have its own donation box */}
      <Donate orphanageId={1} />
      <Donate orphanageId={2} />
    </div>
  );
}

export default App;
