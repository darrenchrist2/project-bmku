import api from "../../services/api";

export async function getMonthlyReport(year, month, page = 1) {
    try {
        const response = await api.get(
            "/inventory-transactions/monthly-report",
            {
                params: {
                    year,
                    month,
                    page,
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
                error.response?.data?.message ??
                "Failed to fetch monthly report.",
        };
    }
}