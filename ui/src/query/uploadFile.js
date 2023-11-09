
const uploadFile = async (url, token, data, showToast ) => {
    console.log(data);
   await fetch(`${url}`, {
        method: 'POST',
        headers: {
            'content-type': 'multipart/form-data; boundary=ebf9f03029db4c2799ae16b5428b06bd',
            'Authorization': "Bearer " + token,
        },
        body:data,
    });


};

export default uploadFile;