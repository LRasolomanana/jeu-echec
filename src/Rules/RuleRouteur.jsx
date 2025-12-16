import { Routes, Route } from "react-router-dom";
import Rule from "./Rule";

export default function RuleRouteur() {
  return (
    <Routes>
      <Route path="rules" element={<Rule />} />
    </Routes>
  );
}
