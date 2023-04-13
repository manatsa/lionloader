import React, {useContext} from 'react';
import {LoginContext} from "./loginContext.jsx";

const useLoginContext =()=>{
    return useContext(LoginContext);
}
 export  default  useLoginContext;