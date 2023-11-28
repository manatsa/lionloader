import React,{Suspense} from 'react';
import Login from "./screens/login";
import Users from "./screens/admin/users";
import Payments from "./screens/finance/payments";
import {Routes, Route} from "react-router-dom";
import Home from "./screens/home";
import Icecash from "./screens/underwriting/icecash";
import Renewals from "./screens/underwriting/renewals";
import Receipts from "./screens/finance/Receipts";
import Settings from "./screens/admin/Settings";
import Roles from "./screens/admin/roles";
import Privileges from "./screens/admin/privileges";
import Loader from "./query/Loader/Loader";
import {CheckLogin} from "./auth/check.login";

function App() {

  return (
    <>

                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/icecash" element={<Icecash />} />
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
