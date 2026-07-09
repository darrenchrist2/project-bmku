import api from "../../services/api";

export async function getInventoryItems() {
    try {
        const response = await api.get("/inventory-items");

        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
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

export async function getCurrentStocks() {
    try {
        const response = await api.get("/inventory-transactions/current-stocks");

        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        console.error('Failed to fetch current stocks:', error);

        return {
            success: false,
            data: [],
            message:
                error.response?.data?.message ||
                'Failed to fetch current stocks.',
        };
    }
}

export async function createInventoryItem(data) {
    try {
        const response = await api.post("/inventory-items", data);

        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        console.error("Failed to create inventory item:", error);

        return {
            success: false,
            data: null,
            errors: error.response?.data?.errors ?? {},
            message:
                error.response?.data?.message ||
                "Failed to create inventory item.",
        };
    }
}