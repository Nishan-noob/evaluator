import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ClassPage from './ClassPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/class/:className" element={<ClassPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
