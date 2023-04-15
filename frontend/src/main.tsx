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
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const client = new QueryClient();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
            <ReactQueryDevtools initialIsOpen={false}/>
            <BrowserRouter>
                <LoginContextProvider>
                    <Layout>
                            <App/>
                    </Layout>
                </LoginContextProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
)
