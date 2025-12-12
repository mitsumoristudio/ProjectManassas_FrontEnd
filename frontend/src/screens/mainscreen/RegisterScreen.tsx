import React from "react";
import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {useRegisterMutation, useRegisterWEmailMutation} from "../../features/userApiSlice";
import {setCredentials} from "../../features/authSlice";
import EmailSentNotification from "../mainscreen/EmailSentNotification"

export default function RegisterScreen() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [emailSent, setEmailSent] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // @ts-ignore
    const {userInfo} = useSelector((state) => state.auth)
   // const [register, {isLoading}] = useRegisterMutation();
    const [register, {isLoading}] = useRegisterWEmailMutation();
    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/projects";

    useEffect(() => {
        if (userInfo && !emailSent) {
            navigate((redirect))
        }
    }, [navigate, redirect, userInfo])

    const onSubmitHandler = async (e: any) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;

        } else if (password.length <= 5) {
            toast.error("Password must be at least 6 characters long");
            return;

        } else {

            try {
                const res = await register({
                    UserName: name,
                    Email: email,
                    Password: password,
                }).unwrap(); // must match the exact DTO properties
              //@ts-ignore
           //     dispatch(setCredentials({...res}));
               // navigate(redirect);
                setEmailSent(true);

            } catch (err: any) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    return (
        <>
            {/* ✅ Email Sent Popup set the state for email*/}
            {emailSent && (
                <EmailSentNotification email={email} onClose={() => navigate("/verifyEmail", {state: {email}})} />
            )}

            {/* Registration Form */}
            <form className={'min-h-[80vh] flex items-center'}
                  onSubmit={onSubmitHandler}>
                <div
                    className={'flex flex-col bg-gradient-to-tr from-gray-200  gap-3 m-auto items-start p-8 min-w-[380px] sm: min-w-160 border rounded-xl text-zinc-700 text-sm shadow-lg '}>
                    <p className={'text-3xl font-semibold mb-2'}
                       data-cy={"register-title"}>Register</p>

                    <div className={'w-full '}>
                        <p className={"mb-2 text-lg font-semibold"}
                           data-cy={"name-headline"}
                        >Name</p>

                        <input className={'border border-zinc-700 rounded-lg w-full p-2 pt-1'}
                               placeholder={"Enter your name"}
                               type={'name'}
                               value={name}
                               required={true}
                               data-cy={"error-name"}
                               data-cx={"input-name"}

                               onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className={'w-full'}>
                        <p className={"mb-2 text-lg font-semibold"}>Email Address</p>
                        <input className={'border border-zinc-700 rounded-lg w-full p-2 pt-1'}
                               placeholder={"Enter your email"}
                               type={'email'}
                               value={email}
                               required={true}
                               data-cy={"error-email"}
                               data-cx={"input-email"}
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className={'w-full'}>
                        <p className={"mb-2 text-lg font-semibold"}>Password</p>
                        <input className={'border border-zinc-700 rounded-lg w-full p-2 pt-1'}
                               placeholder={"Enter your password"}
                               type={'password'}
                               value={password}
                               required={true}
                               data-cy={"error-password"}
                               data-cx={"input-password"}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className={'w-full'}>
                        <p className={"mb-2 text-lg font-semibold"}>Confirm Password</p>
                        <input className={'border border-zinc-700 rounded-lg w-full p-2 pt-1'}
                               placeholder={"Confirm your password"}
                               type={'confirmPassword'}
                               value={confirmPassword}
                               required={true}
                               data-cy={"error-confirm_password"}
                               data-cx={"input-confirm_password"}
                               onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        data-cy={"submit"}
                        className="flex max-w-xs  mt-2 flex-1 items-center justify-center rounded-lg border border-transparent
                        bg-indigo-600 px-8 py-2 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2
                        focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                    >
                        Sign Up
                    </button>

                    <div className={"flex flex-col items-center"}>
                        <p className={"text-gray-800 w-full items-center ml-12"}>Already have an account?
                            <span>  </span>
                            <span className={"text-indigo-700 font-semibold underline cursor-pointer"}>
                                <button type={"button"}
                                        data-cy={"submit2"}>
                                    <Link to={"/login"}> Click here </Link>
                                </button>
                        </span></p>
                    </div>
                </div>
            </form>
        </>
    )
}