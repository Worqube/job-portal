import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <div className="items-center">
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
