import React, {Suspense, useRef} from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
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
import QueryProvider from "./query/QueryProvider";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";
import Loader from "./query/Loader/Loader";
import {QueryCache, QueryClient} from "@tanstack/react-query";
import AppStage from "./AppStage";



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
                <LoginContextProvider>
                    <Layout>
                        <DevSupport ComponentPreviews={ComponentPreviews}
                                    useInitialHook={useInitial}
                        >
                            <AppStage />
                        </DevSupport>
                    </Layout>
                </LoginContextProvider>
        </BrowserRouter>
    </React.StrictMode>
)
