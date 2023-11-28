import React,{Suspense} from 'react';
import Login from "./screens/login";
import Users from "./screens/admin/users";
import Payments from "./screens/finance/payments";
import {Routes, Route, Navigate} from "react-router-dom";
import Home from "./screens/home";
import NewBusiness from "./screens/underwriting/new.business";
import Renewals from "./screens/underwriting/renewals";
import Receipts from "./screens/finance/Receipts";
import Settings from "./screens/admin/Settings";
import Industry from "./screens/product/industry.jsx";
import Category from "./screens/product/category.jsx";
import Product from "./screens/product/product.jsx";
import Roles from "./screens/admin/roles";
import Privileges from "./screens/admin/privileges";

function App() {

  return (
    <>

                <Routes>
                    <Route path="/home" element={<Navigate to={'/'} />} />
                    <Route path="/new/business" element={<NewBusiness />} />
                    <Route path="/renewals" element={<Renewals />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/receipts" element={<Receipts />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/privileges" element={<Privileges />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/industry" element={<Industry />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/" element={<Product />} />
                </Routes>


    </>
  );
}

export default App;
