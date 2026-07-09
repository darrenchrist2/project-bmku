import api from "../../services/api";

export async function getInventoryItems() {
    try {
        const response = await api.get("/inventory-items");

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('Failed to fetch inventory items:', error);

        return {
            success: false,
            data: [],
            message:
                error.response?.data?.message ||
                'Failed to fetch inventory items.',
        };
    }
}