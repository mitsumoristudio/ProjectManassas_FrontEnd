
import React, {useState} from "react";
import {toast} from "react-toastify";
import { useLocation, useNavigate} from "react-router-dom";
import {useForgotPasswordMutation, useGetAllUsersQuery} from "../../features/userApiSlice"


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    const [forgotPassword, ] = useForgotPasswordMutation();
    const {data: userdata} = useGetAllUsersQuery();

 //   console.log("User Data", userdata);

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        const foundUser = await userdata?.users?.find(user => user.email === email)
        try {
            if (foundUser) {
                await forgotPassword({email});

                toast.success("Sent Password reset instructions");
                redirect("/");
                navigate("/");
            } else {
                toast.error("Email Account not found. Please try again");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        }
    }

    return (
        <>
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
                        Submit
                    </button>



                </div>
            </form>
        </>
    )

}