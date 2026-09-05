import api from "../api/axios";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data.data;
};

export const getUser = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data.data;
};

export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};