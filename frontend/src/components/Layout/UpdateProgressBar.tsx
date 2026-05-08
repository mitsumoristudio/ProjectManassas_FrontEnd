
import React, {useEffect, useState} from "react";

interface Props {
    progress: number;
}

export default function UpdateProgressBar({progress}: Props) {


    return(
        <>
            <div className="w-40">
                <div className="flex justify-between mb-1">
        <span className="text-md font-medium text-body">
          Uploading...
        </span>

                    <span className="text-md font-medium text-body">
          {progress}%
        </span>
                </div>

                <div className="w-full bg-neutral-quaternary rounded-full h-2 overflow-hidden">
                    <div
                        className="
            bg-brand
            animate-pulse
            h-2
            rounded-full
            transition-all
            duration-500
            ease-out
          "
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>
        </>
    )
}