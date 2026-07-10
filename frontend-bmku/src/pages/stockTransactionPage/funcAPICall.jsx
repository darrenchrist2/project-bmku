import api from "../../services/api";

export async function getMonthlyReport(year, month) {
    try {
        const response = await api.get("/inventory-transactions/monthly-report", {
            params: {
                year,
                month,
            },
        });

        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        console.error("Failed to fetch monthly report:", error);

        return {
            success: false,
            data: [],
            message:
                error.response?.data?.message ||
                "Failed to fetch monthly report.",
        };
    }
}