import React from 'react';
import AppMenu from "./AppMenu";
import Box from "@mui/material/Box";

const Layout =({children})=>{

    return (
           <>
               <Box component={'div'} style={{width:'100%'}} className={' flex justify-content-center align-items-start'}>
                   <Box component={'div'} sx={{mb:5}} className={'flex justify-content-center'}>
                        <AppMenu />
                   </Box>
                   <div style={{width:'100%'}} className={'flex justify-content-center align-self-start align-items-start'} >
                       <div className={'w-full align-items-start'}>
                           {children}
                       </div>
                   </div>
               </Box>

           </>

    )
}

export default Layout;