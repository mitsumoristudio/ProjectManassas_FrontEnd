

import {motion} from 'framer-motion'

export default function StackCard({icon:Icon, name, value, color}) {
    return (
        <main className={"grid  sm:grid-row-2 lg:grid-row-4 xl:grid-cols-4 mb-8"}>
        <motion.div
            className={'bg-gray-900 bg-opacity-90 backdrop-blur-md overflow-hidden  shadow-lg rounded-xl border border-gray-900'}
            whileHover={{y: -5, boxShadow: "0 35px 60px -14px rgba(0,0,0,0.5)"}}>
            <div className={'px-4 py-4 sm: p-6'}>
                <span className={'flex items-center text-sm font-medium text-gray-500'}>
                    <Icon
                        size={20}
                        className={'mr-2'}
                        style={{color}}
                    />
                    {name}
                </span>
                <p className={'mt-1 text-3xl font-semibold text-gray-100'}>{value}</p>
            </div>

        </motion.div>
        </main>
    )
}