import { createContext, useState } from "react";

export const AppContext = createContext()


export const AppContextProvider = (props)=>{
    const backEndUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)
    const value = {
        backEndUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData

    }
     return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
     )
}