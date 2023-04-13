import React from 'react';
import AppMenuBar from "./AppMenuBar.jsx";
import AppFooterBar from "./AppFooterBar.jsx";

const Layout =({children})=>{
    return (
        <>
            <AppMenuBar/>
            <div style={{width:'100%', paddingLeft:20, paddingRight:20, }}>
                {children}
            </div>
            <AppFooterBar/>

        </>
    )
}

export default Layout;