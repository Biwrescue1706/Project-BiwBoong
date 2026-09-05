import api from "../api/axios";

// GET
export const getTransactions = async () => {
    const response = await api.get("/transactions");
    return response.data.data;
};

// CREATE
export const createTransaction = async (data) => {
    const response = await api.post("/transactions", data);
    return response.data;
};

// UPDATE
export const updateTransaction = async (id, data) => {
    const response = await api.patch(`/transactions/${id}`, data);
    return response.data;
};

// DELETE
export const deleteTransaction = async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
};