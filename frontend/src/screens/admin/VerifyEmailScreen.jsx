
import {useRef, useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {motion} from "framer-motion";
import {toast} from "react-toastify";
import {useVerifyEmailMutation, useResendVerificationCodeMutation} from "../../features/userApiSlice"

//const inputRefs = useRef([]);

export default function VerifyEmailScreen() {
    const navigate = useNavigate();
    const location = useLocation();

    const stateEmail = location.state?.email;
    const queryEmail = new URLSearchParams(location.search).get("email");

    const email = stateEmail || queryEmail;

    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const [resendCode] = useResendVerificationCodeMutation();

    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);

    useEffect(() => {
        if (!email) {
            toast.error("Missing Email - Verification link is invalid");
            navigate("/register");
        }
    })

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);

        if (value && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const submitHandler = async () => {
        const code = digits.join("");

        if (code.length !== 6) {
            toast.error("Please enter the full 6-digit code.");
            return;
        }

        try {
            await verifyEmail({ email, code }).unwrap();

            console.log("Sending Payload:", { email, code});

            toast.success("Email verified!");
            navigate("/login");

        } catch (error) {
            toast.error(error?.data?.message || "Invalid code");
        }
    };

    const resendHandler = async () => {
        try {
            await resendCode(email).unwrap();
            toast.success("Code resent!");
            setDigits(["", "", "", "", "", ""]);
            inputs.current[0].focus();
        } catch (error) {
            toast.error("Unable to resend code.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Verify Your Email
                </h2>

                <p className="text-gray-600 mb-6">
                    Enter the 6-digit verification code sent to:
                    <span className="font-semibold block mt-1">{email}</span>
                </p>

                {/* 6 Digit Inputs */}
                <div className="flex justify-center gap-3 mb-6">
                    {digits.map((digit, idx) => (
                        <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={digit}
                            ref={(el) => (inputs.current[idx] = el)}
                            onChange={(e) => handleChange(e.target.value, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            className="w-12 h-12 border border-gray-300 rounded-lg text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    ))}
                </div>

                {/* Submit */}
                <button
                    disabled={isLoading}
                    onClick={submitHandler}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Verify Email
                </button>

                {/* Resend Code */}
                <p className="mt-4 text-gray-600">
                    Didn’t get the code?
                    <button
                        onClick={resendHandler}
                        className="ml-2 text-indigo-600 font-semibold hover:underline"
                    >
                        Resend Code
                    </button>
                </p>
            </div>
        </div>
    );
}