import axios from 'axios';

export default async function addChannel(data) 
{    
    // TODO: Hacky
    const cleanedData = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== 'None') {
            if (typeof data[key] === 'boolean') {
                acc[key] = data[key] ? "true" : "false"; // Convert booleans to "true" or "false"
            } else if (data[key] instanceof File) {
                // For File objects, we'll just send the file name
                acc[key] = data[key].name;
            } else {
                acc[key] = String(data[key]); // Convert everything else to string
            }
        }
        return acc;
    }, {});

    const response = await axios.post('/api/addchannel', cleanedData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}