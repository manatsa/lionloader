import React from 'react';
import AppFooterBar from "./AppFooterBar.jsx";
import AppMenu from "./AppMenu";

const Layout =({children})=>{
    return (
           <>
                <AppMenu />
                <div style={{width:'100%'}} align={'center'} >
                    {children}
                </div>
           </>

    )
}

export default Layout;