import React, { useState } from 'react';

function TabSwitcher() {
    const [activeTab, setActiveTab] = useState('Student');
    const tabs = ['Student', 'Faculty', 'Admin'];

    return (
        <div className='mt-6  shrink-0  w-[80%]'>
            <div className="flex justify-center">
                {/* Outer Container */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl  shadow-inner">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer
                ${activeTab === tab
                                    ? 'bg-white text-slate-900 shadow-md'
                                    : 'text-slate-500 hover:text-slate-700'
                                }
                `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 w-full max-w-md">
                {
                    activeTab === 'Student' && (
                        <div className='bg-green-500 h-32 rounded-xl p-4 text-white'>
                        </div>
                    )
                }
                {
                    activeTab === 'Faculty' && (
                        <div className='bg-red-500 h-32 rounded-xl p-4 text-white'>
                        </div>
                    )
                }
                {
                    activeTab === 'Admin' && (
                        <div className='bg-blue-500 h-32 rounded-xl p-4 text-white'>
                        </div>
                    )
                }
            </div>

        </div>
    );
}

export default TabSwitcher;