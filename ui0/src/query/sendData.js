import React,{ useState, useEffect } from "react";
import axios from "axios";
import GetFromAPI from "../api/getFromAPI.js";
import {useQuery} from "@tanstack/react-query";

export const sendData = async  (url,token, item) => {

        const {data} =  await axios.post(url, JSON.stringify(item),
            {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    timeout: 120000,
                    timeoutErrorMessage:"Your request has timed out.\nCheck your internet connectivity.",
            })

        return data
    }

