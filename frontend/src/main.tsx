import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './index.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
// @ts-ignore
import {LoginContextProvider} from "./context/loginContext";
import {BrowserRouter} from "react-router-dom";
// @ts-ignore
import Layout from "./layout/layout";
import '/node_modules/primeflex/primeflex.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <LoginContextProvider>
                <Layout>
                    <App />
                </Layout>
            </LoginContextProvider>
        </BrowserRouter>
    </React.StrictMode>
)
