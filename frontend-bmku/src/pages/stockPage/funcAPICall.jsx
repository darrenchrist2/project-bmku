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

export async function getCurrentStocks(page = 1) {
    try {
        const response = await api.get(
            "/inventory-transactions/current-stocks",
            {
                params: {
                    page,
                    per_page: 5,
                },
            }
        );

        return {
            success: true,
            data: response.data.data,
            pagination: response.data.pagination,
            message: response.data.message,
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            data: [],
            pagination: null,
            message:
                error.response?.data?.message ||
                "Failed to fetch current stocks.",
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

export async function updateInventoryItem(id, data) {
    try {
        const response = await api.put(`/inventory-items/${id}`, data);

        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        console.error("Failed to update inventory item:", error);

        return {
            success: false,
            data: null,
            errors: error.response?.data?.errors ?? {},
            message:
                error.response?.data?.message ||
                "Failed to update inventory item.",
        };
    }
}

export async function deleteInventoryItem(id) {
    try {
        const response = await api.delete(`/inventory-items/${id}`);

        return {
            success: true,
            data: response.data.data ?? null,
            message: response.data.message,
        };
    } catch (error) {
        console.error("Failed to delete inventory item:", error);

        return {
            success: false,
            data: null,
            message:
                error.response?.data?.message ||
                "Failed to delete inventory item.",
        };
    }
}