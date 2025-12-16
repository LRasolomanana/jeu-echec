import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import LoginRouteur from "./Auth/LoginRouteur";
import RuleRouteur from "./Rules/RuleRouteur";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth/*" element={<LoginRouteur />} />
      <Route path="/rules/*" element={<RuleRouteur />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
