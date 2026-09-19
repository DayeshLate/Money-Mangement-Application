export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API_ENDPOINT ={
    LOGIN :"/profile/login",
    REGISTER: "/profile/register",

    GET_USER_INFO : "/profile/me",

    GET_ALL_CATEGORIES : "/categories",
    SAVE_CATEGORIES : "/categories/save",

    GET_ALL_INCOME: "/income",
    CREATE_INCOME: "/income/add",
    DELETE_INCOME: "/income/",

    GET_ALL_EXPENSE: "/expense",
    CREATE_EXPENSE: "/expense/add",
    DELETE_EXPENSE: "/expense/",

    FILTER: "/filter",
    EXPORT_REPORT: "/report/export",
}