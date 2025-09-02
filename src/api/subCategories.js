import apiClient from "./https";

const getSubCategories = async(params={})=>{
    try {
        const response = await apiClient.get('/subcategory', {params:params})
        return response;
    } catch (error) {
        throw error;
    }
}

// Get subcategory by name
const getSubCategoryByName = async(name)=>{
    try {
        console.log('API Call - getSubCategoryByName for:', name);
        console.log('API Call - Condition param:', JSON.stringify({ name: name }));

        const response = await apiClient.get('/subcategory', {
            params: {
                condition: JSON.stringify({ name: name })
            }
        })

        console.log('API Response - getSubCategoryByName:', response);
        console.log('API Response data:', response.data);
        console.log('API Response data.data:', response.data?.data);
        console.log('API Response data.success:', response.data?.success);
        return response;
    } catch (error) {
        console.error('API Error - getSubCategoryByName:', error);
        throw error;
    }
}

export { getSubCategories, getSubCategoryByName }




