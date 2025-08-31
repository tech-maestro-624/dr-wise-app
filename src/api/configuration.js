import apiClient from "./https";

const getconfig = async()=>{
    try {
        const response = await apiClient.get('/config/get-configs')
        return response;
    } catch (error) {
        throw error;
    }
}

export { getconfig }


