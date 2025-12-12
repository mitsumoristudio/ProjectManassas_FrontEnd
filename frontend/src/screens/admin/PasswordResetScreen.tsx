import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {toast} from "react-toastify";
import {useResetPasswordMutation} from "../../features/userApiSlice";

export default function PasswordResetScreen() {
    const navigate = useNavigate();
    const {search} = useLocation();
    const params = new URLSearchParams(search);

    const email = params.get("email");
    const token = params.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetPassword, {isLoading}] = useResetPasswordMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in all the fields");
            return;
        }

        if (newPassword.length <= 6) {
            toast.error("Password is too short. Must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Password does not match")
            return;
        }

        try {
            await resetPassword({email, token, newPassword}).unwrap();

            toast.success("Password reset successfully!");
            navigate("/login");

        } catch (error) {
            toast.error(error?.data?.message || "Invalid or expired reset link");
        }
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                        Reset Password
                    </h2>

                    <p className="text-gray-600 text-center mb-6">
                        Enter a new password for <span className="font-semibold">{email}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Password */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-300"
                        >
                            {isLoading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}