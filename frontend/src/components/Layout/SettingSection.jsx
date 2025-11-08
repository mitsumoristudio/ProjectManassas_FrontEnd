

import React from 'react';
import {motion} from 'framer-motion';

export default function SettingSection({icon: Icon, title, children}) {
    return (
        <motion.div
            className={'bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8'}
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <div className={'flex items-center mb-4 px-2'}>
                <Icon className={'text-indigo-400 mr-4 size-8'} />
                <h2 className={'text-xl font-semibold text-gray-100'}>{title}</h2>
            </div>
            {children}
        </motion.div>
    )
}