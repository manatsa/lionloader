import React,{ useState, useEffect } from "react";
import axios from "axios";

export const useSend = ({url,objectString, setIsPending, token}) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);
            try {
                const response=await axios
                    .post(url, objectString, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                        timeout: 120000,
                        timeoutErrorMessage:
                            "Your request has timed out.\nCheck your internet connectivity.",
                    })
                    .catch((error) => {
                        const ex = error.toJSON();
                        console.log(`SYNCH ERROR`, ex.message);
                        setIsPending(false);
                    });

                setIsPending(false);
                if (!response.ok) throw new Error(response.statusText);
                const json = await response.json();
                setData(json);
                setError(null);
            } catch (error) {
                setError(`${error} Could not Fetch Data `);
                setIsPending(false);
            }
        };
        fetchData();
    }, [url]);
    return { data, error };
};