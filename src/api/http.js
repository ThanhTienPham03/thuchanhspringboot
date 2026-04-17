import axios from "axios";

export const http = axios.create({
    baseURL: "http://localhost:8080", // đổi nếu BE bạn chạy port khác
    headers: { "Content-Type": "application/json" },
});