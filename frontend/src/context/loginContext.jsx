import React, {createContext, useContext, useState} from 'react'

export const LoginContext = createContext()

export const LoginContextProvider = ({ children }) => {
    const [token, setToken] = useState();
    const [login, setLogin] = useState();

    const stored=localStorage.getItem('token')
    if(token && (!stored || stored?.length<1)){
        localStorage.setItem('token', token);
    }

    if(!token && stored){
        setToken(stored);
    }

    const value = {
        token,
        setToken,
        login,
        setLogin
    }

    return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
}