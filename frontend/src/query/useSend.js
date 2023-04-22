import React,{ useState, useEffect } from "react";
import axios from "axios";
import GetFromAPI from "../api/getFromAPI.js";
import {useQuery} from "@tanstack/react-query";

export const useSend =  (url,token, objectString, id) => {

    async function sendData(){
        const {data} =  await axios
            .post(url, objectString, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                timeout: 120000,
                timeoutErrorMessage:
                    "Your request has timed out.\nCheck your internet connectivity.",
            })

        return data
    }

    const {data, error, isError, isLoading } =  useQuery(id, sendData,
        {
            refetchOnWindowFocus: false,
            staleTime:1800000
        })


    return {data, error, isError, isLoading };
};