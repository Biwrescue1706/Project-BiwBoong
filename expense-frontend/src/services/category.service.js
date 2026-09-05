import api from "../api/axios";

export const getCategories = async (type) => {
    const res = await api.get("/categories", { params: { type } });
    return res.data.data;
};

export const createCategory = async (data) => {
    const res = await api.post("/categories", data);
    return res.data;
};

export const updateCategory = async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
};

export const deleteCategory = async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
};