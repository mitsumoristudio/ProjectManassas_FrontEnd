
import React, {useState} from "react";
import {toast} from "react-toastify";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useForgotPasswordMutation} from "../../features/userApiSlice"


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    const [forgotPassword, {isLoading} ] = useForgotPasswordMutation();

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            await forgotPassword({ email }).unwrap();

            toast.success("Email sent successfully.", {
                onClose: () => navigate("/"),
            });

        } catch (error) {
            toast.error(error.data?.message || error.message);
        }
    }

    return (
        <>

            <NavLink to={"/"} className={" py-2 px-2 flex items-center gap-2 hover:text-gray-700"}>
                <svg width="30" height="30" viewBox="0 0 96 96" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M48 0C21.49 0 0 21.49 0 48C0 74.51 21.49 96 48 96C74.51 96 96 74.51 96 48C96 21.49 74.51 0 48 0ZM48 88C26.021 88 8 69.979 8 48C8 26.021 26.021 8 48 8C69.979 8 88 26.021 88 48C88 69.979 69.979 88 48 88ZM68 48L48 68L28 48L48 28L68 48Z"
                          fill="#30E0A5"/>
                </svg>
                <h1 className="text-2xl font-semibold">Mori Solution</h1>
            </NavLink>

            <form className={'min-h-[90vh] flex items-center w-full'}
                  onSubmit={onSubmitHandler}
            >
                <div
                    className={'flex flex-col gap-3 m-auto items-start p-8 min-w-[320px] sm: min-w-120 border rounded-xl text-zinc-700 text-sm shadow-lg '}>
                    <p className={'text-3xl font-semibold mb-2'}> Forgot Password</p>

                    <div className={'w-full '}>
                        <p className={"mb-2 text-md font-semibold"}>
                            Enter your email address and we'll send you a link to reset your password
                        </p>
                        <input className={'border border-zinc-700 rounded-lg w-full p-2 pt-1'}
                               placeholder={"Enter your email"} type={'email'} value={email} required={true}
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <p className={"text-gray-600 items-center mb-2"}>
                        If an account exists for this email, you will receive a password reset link shortly.
                    </p>

                    <button
                        type="submit"
                        className="flex max-w-xs ml-20 cursor-pointer mt-2 flex-1 items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-8 py-2 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                    >
                        {isLoading ? "Sending..." : "Submit"}
                    </button>



                </div>
            </form>
        </>
    )

}