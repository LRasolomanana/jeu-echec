import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";

export default function LoginRouteur() {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
        </Routes>
    );
}