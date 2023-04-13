import React,{ useState, useEffect } from "react";
import axios from "axios";

export const useFetch = ({url, token ,setIsPending}) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);
            try {
                const response = await axios({
                    method: "GET",
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    timeoutErrorMessage: "Your request has timed out.",
                });
                setIsPending(false);
                if (!response.ok) throw new Error(response.statusText);
                const json = await response.json();
                setData(json);
                setError(null);
                return response?.data;

            } catch (error) {
                setError(`${error} Could not Fetch Data `);
                setIsPending(false);
            }
        };
        fetchData();
    }, [url]);
    return { data, error };
};