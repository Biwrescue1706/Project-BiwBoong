// src/services/transaction.service.js
import api from "../api/axios";

export const getTransactions = async () => {
    const response = await api.get("/transactions");
    return response.data?.data || [];
};

export const getTransaction = async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data?.data || response.data;
};

export const createTransaction = async (data) => {
    const response = await api.post("/transactions", data);
    return response.data;
};

export const updateTransaction = async (id, data) => {
    const response = await api.patch(`/transactions/${id}`, data);
    return response.data;
};

export const deleteTransaction = async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
};