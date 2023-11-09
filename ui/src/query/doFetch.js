import React,{ useState, useEffect } from "react";
import axios from "axios";
import GetFromAPI from "../api/getFromAPI.js";
import {useQuery} from "@tanstack/react-query";

export const doFetch =  (url,token, id) => {

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

    return {data, error, isError, isLoading };
};