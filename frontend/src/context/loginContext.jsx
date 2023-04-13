import React, {createContext, useContext, useState} from 'react'

export const LoginContext = createContext()

export const LoginContextProvider = ({ children }) => {
    const [token, setToken] = useState();
    const [login, setLogin] = useState();

    const value = {
        token,
        setToken,
        login,
        setLogin
    }

    return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
}