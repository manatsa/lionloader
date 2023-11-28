import React, {Suspense, useRef} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './index.css';
// import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import '/node_modules/primeflex/primeflex.css';
// import "primereact/resources/themes/saga-green/theme.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import AppStage from "./AppStage";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
         <AppStage/>
     </React.StrictMode>
)
