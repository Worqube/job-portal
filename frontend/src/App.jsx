import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <div className="items-center">
      App
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
