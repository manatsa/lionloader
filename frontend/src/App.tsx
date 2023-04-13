import React from 'react';
import Login from "./screens/login";
import Users from "./screens/admin/users";
import Payments from "./screens/finance/payments";
import {Routes, Route} from "react-router-dom";
import Home from "./screens/home";
import NewBusiness from "./screens/underwriting/new.business";
import Renewals from "./screens/underwriting/renewals";
import Receipts from "./screens/finance/Receipts";
import Settings from "./screens/admin/Settings";
import Roles from "./screens/admin/roles";
import Privileges from "./screens/admin/privileges";

function App() {
  return (
    <>
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/new/business" element={<NewBusiness />} />
            <Route path="/renewals" element={<Renewals />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/privileges" element={<Privileges />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Login />} />
        </Routes>
    </>
  );
}

export default App;
