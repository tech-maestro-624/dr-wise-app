import apiClient from "./https";

const getSubCategories = async(params={})=>{
    try {
        const response = await apiClient.get('/subcategory', {params:params})
        return response;
    } catch (error) {
        throw error;
    }
}

export { getSubCategories }




