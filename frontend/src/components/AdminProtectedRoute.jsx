import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // store 'admin' in localStorage when logging in

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (role !== "admin") {
        return <Navigate to="/" />; // redirect non-admins to home
    }

    return children;
}
