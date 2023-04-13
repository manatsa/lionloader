import axios from "axios";

const GetFromApi = async (token, segment, setIndicator) => {
    setIndicator(true);
    const response = await axios({
        method: "GET",
        url: segment,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        timeoutErrorMessage: "Your request has timed out.",
    });
    setIndicator(false);
    return response?.data;
};

export default GetFromApi;