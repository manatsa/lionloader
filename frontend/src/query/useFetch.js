import React,{ useState, useEffect } from "react";
import axios from "axios";
import GetFromAPI from "../api/getFromAPI.js";
import {useQuery} from "@tanstack/react-query";

export const useFetch =  (url,token, id) => {

    async function fetchData(){
        const {data} = await axios({
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            timeoutErrorMessage: "Your request has timed out.",
        })

        return data
    }

    const {data, error, isError, isLoading } =  useQuery(id, fetchData)
    
    /*function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    delay(10000). then(() => console.log('after 3 seconds'));*/

    return {data, error, isError, isLoading };
};