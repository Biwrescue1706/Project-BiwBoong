import api from "../api/axios";

// ดึงประเภททั้งหมด
export const getTypes = async () => {
    const res = await api.get("/types");
    return res.data.data;
};

// เพิ่มประเภท
export const createType = async (data) => {
    const res = await api.post("/types", data);
    return res.data;
};

// แก้ไขประเภท
export const updateType = async (id, data) => {
    const res = await api.put(`/types/${id}`, data);
    return res.data;
};

// ลบประเภท
export const deleteType = async (id) => {
    const res = await api.delete(`/types/${id}`);
    return res.data;
};