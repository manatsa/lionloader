import React from 'react';
import AppMenuBar from "./AppMenuBar.jsx";
import AppFooterBar from "./AppFooterBar.jsx";

const Layout =({children})=>{
    return (
        <>

            <div className={'surface-300'} style={{width:'100%'}}>
                <AppMenuBar/>
                <div align={'center'} className={'surface-300'} style={{width:'100%'}} >
                    {children}
                </div>
                <AppFooterBar/>
            </div>


        </>
    )
}

export default Layout;