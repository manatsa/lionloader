import React from 'react';
import AppMenuBar from "./AppMenuBar.jsx";
import AppFooterBar from "./AppFooterBar.jsx";

const Layout =({children})=>{
    return (
        <>

            <div className={'grid col-12'} style={{margin:'10px'}} >
                <AppMenuBar/>
                <div align={'center'}style={{width:'100%'}} >
                    {children}
                </div>
                <AppFooterBar/>
            </div>


        </>
    )
}

export default Layout;