import type { Reader } from "../types/Reader";
import apiClient from "./apiClient";

export const getAllReaders = async (): Promise<Reader[]> => {
  const response = await apiClient.get("/reader");
  return response.data;
};

export const deleteReader = async (_id: string): Promise<void> => {
  await apiClient.delete(`/reader/${_id}`);
};

export const addReader = async (readerData: Omit<Reader, "_id">): Promise<Reader> => {
  const response = await apiClient.post("/reader", readerData);
  return response.data;
};

export const updateReader = async (_id: string, readerData: Omit<Reader, "_id">) => {
  const response = await apiClient.put(`/reader/${_id}`, readerData);
  return response.data;
};

export const getReaderCount = async (): Promise<number> => {
  const response = await apiClient.get("/reader/count");
  return response.data.count;
};
