
import React from "react";
import {MailCheck, X} from "lucide-react";


export default function EmailSentNotification({email, onClose}) {

    return (
        <>
            <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                    >
                        <X size={20} />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 dark:bg-green-800 p-4 rounded-full">
                            <MailCheck className="text-green-600 dark:text-green-300" size={40} />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center mb-2 text-gray-300">
                        Verification Email Sent
                    </h2>

                    {/* Description */}
                    <p className="text-center text-gray-300 dark:text-gray-300 mb=6">
                        A verification email has been sent to:
                    </p>

                    <p className="text-center font-semibold text-blue-600 dark:text-blue-400 mb-6">
                        {email}
                    </p>

                    <p className="text-center text-gray-300 dark:text-gray-400">
                        Please check your inbox (and spam folder).
                        Click the link inside to complete your registration.
                    </p>
                </div>
            </div>
        </>
    )
}