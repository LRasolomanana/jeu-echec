import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import LoginRouteur from "./Auth/LoginRouteur";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth/*" element={<LoginRouteur />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
