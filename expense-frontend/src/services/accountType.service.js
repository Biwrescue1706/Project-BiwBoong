// src/services/accountType.service.js
import api from "../api/axios";

export const getAccountTypes = async () => {
    const response = await api.get("/account-types");
    return response.data?.data || [];
};

export const createAccountType = async (data) => {
    const response = await api.post("/account-types", data);
    return response.data;
};

export const updateAccountType = async (id, data) => {
    const response = await api.patch(`/account-types/${id}`, data);
    return response.data;
};

export const deleteAccountType = async (id) => {
    const response = await api.delete(`/account-types/${id}`);
    return response.data;
};