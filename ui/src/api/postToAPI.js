import axios from "axios";


const PostToApi = async (token, segment, objectString, setIndicator) => {
    setIndicator(true);
    const response = await axios
        .post(segment, objectString, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            timeout: 120000,
            timeoutErrorMessage:
                "Your request has timed out.\nCheck your internet connectivity.",
        })
        .then((res) => {
            setIndicator(false);
            return res;
        })
        .catch((error) => {
            const ex = error.toJSON();
            console.log(`SYNCH ERROR`, ex.message);
            setIndicator(false);
        });

    setIndicator(false);
    return response;
};

export default PostToApi;