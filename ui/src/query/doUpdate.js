
const doUpdate = async (url, token, id, data ) => {
    const response = await fetch(`${url}${id}`, {
        method: id? 'PUT':'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error:: '+response?.statusText);
    }

    return response.json();
};

export default doUpdate;