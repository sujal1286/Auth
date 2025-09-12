import axios from "axios";
import { createContext, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import React from 'react'

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backEndUrl = import.meta.env.VITE_BACKEND_URL;
    axios.defaults.withCredentials = true;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backEndUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData || data.user);
                setIsLoggedIn(true);
            } else {
                setUserData(null);
                setIsLoggedIn(false);
                // don't toast here on normal unauthenticated
            }
        } catch (error) {
            setUserData(null);
            setIsLoggedIn(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(backEndUrl + '/api/auth/logout');
            setUserData(null);
            setIsLoggedIn(false);
        } catch (err) {
            // ignore
        }
    };

    const value = {
        backEndUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData, logout
    };

    useEffect(() => {
        // try to populate user data on app load (if cookie present)
        getUserData();
    }, []);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};