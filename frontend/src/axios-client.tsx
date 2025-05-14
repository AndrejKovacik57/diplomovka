import axios from "axios";
const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
})


axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axiosClient.interceptors.response.use(
    response => response,
    error => {
        const { response } = error;

        if (!response) {
            alert("Network error or server did not respond.");
            throw error;
        }

        switch (response.status) {
            case 401:
                localStorage.removeItem('ACCESS_TOKEN');
                window.location.href = '/';
                break;

            case 403:
                window.location.href = '/403';
                break;

            case 404:
                window.location.href = '/404';
                break;

            case 422:
                break;

            case 500:
            case 503:
                alert("Server error. Please try again later.");
                break;

            default:
                console.warn("Unhandled error status:", response.status);
                break;
        }

        throw error;
    }
);


export default axiosClient;
