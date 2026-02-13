import React, { useState } from 'react'
import '../index.css'
import department from '../assets/Department.png'
import { FaGraduationCap, FaRegAddressCard } from 'react-icons/fa';
import { MdSecurity, MdOutlineLock, MdOutlineRemoveRedEye, MdOutlinePersonAddAlt } from 'react-icons/md';
import { HiOutlineArrowRight } from 'react-icons/hi';

function Login() {
    const [activeTab, setActiveTab] = useState('Student');
    const tabs = ['Student', 'Faculty', 'Admin'];

    return (
        <div className='flex flex-col lg:flex-row h-screen bg-gray-200 w-screen overflow-hidden'>
            {/* Left Section - Image (Hidden on mobile) */}
            <div className="hidden lg:block relative h-screen lg:w-[40%] overflow-hidden">
                <img
                    src={department}
                    alt="Landscape"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent opacity-80"></div>
                
                {/* Top Left Logo */}
                <div className='absolute top-2 left-4 flex items-center'>
                    <FaGraduationCap className="text-4xl md:text-6xl text-white mx-2 md:mx-4" />
                    <h2 className="text-2xl md:text-4xl font-bold text-white">University Of Sargodha</h2>
                </div>
                
                {/* Bottom Text */}
                <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-lg md:text-xl font-bold">University Of Sargodha</h2>
                </div>
            </div>

            {/* Right Section - Login */}
            <div className='w-full lg:w-[60%] h-screen flex items-center justify-center p-4'>
                {/* Card */}
                <div className='bg-white w-full max-w-lg shadow-2xl flex flex-col items-center rounded-3xl p-8 md:p-12'>
                    
                    {/* Security Icon */}
                    <div className='bg-blue-50 w-14 h-14 mb-6 flex items-center justify-center rounded-xl'>
                        <MdSecurity className='w-8 h-8 text-[#1e3a5f]' />
                    </div>

                    {/* Welcome Text */}
                    <div className='text-center mb-8'>
                        <h1 className='text-slate-800 text-2xl md:text-3xl font-bold uppercase tracking-tight'>Welcome Back!</h1>
                        <p className='text-slate-400 text-sm font-medium mt-1'>
                            Please Enter your credentials to access dashboard
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                    activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Dynamic Form Content */}
                    <form className='w-full space-y-5'>
                        <div>
                            <label className='block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2'>
                                {activeTab} ID / Email
                            </label>
                            <div className='relative'>
                                <FaRegAddressCard className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg' />
                                <input 
                                    type="text" 
                                    placeholder={`Enter your ${activeTab} ID`} 
                                    className='w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-slate-300'
                                />
                            </div>
                        </div>

                        <div>
                            <div className='flex justify-between mb-2'>
                                <label className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>Password</label>
                                <a href='#' className='text-[10px] font-bold text-slate-700 hover:underline'>Forgot Password?</a>
                            </div>
                            <div className='relative'>
                                <MdOutlineLock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl' />
                                <input 
                                    type="password" 
                                    placeholder='••••••••' 
                                    className='w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all'
                                />
                                <MdOutlineRemoveRedEye className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer text-xl' />
                            </div>
                        </div>

                        <div className='flex items-center space-x-2'>
                            <input type="checkbox" id="keep" className='w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900' />
                            <label htmlFor="keep" className='text-sm font-semibold text-slate-600 cursor-pointer'>Keep me signed in</label>
                        </div>

                        <button className='w-full bg-[#1e3a5f] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#152943] transition-colors uppercase tracking-widest text-sm mt-2'>
                            Sign In Securely
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className='w-full mt-10 pt-6 border-t border-slate-100 flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                            <div className='bg-blue-50 p-2 rounded-full'>
                                <MdOutlinePersonAddAlt className='text-blue-600' />
                            </div>
                            <span className='text-xs font-semibold text-slate-400'>New admission?</span>
                        </div>
                        <a href='#' className='flex items-center text-xs font-bold text-[#1e3a5f] hover:translate-x-1 transition-transform'>
                            Contact Registrar <HiOutlineArrowRight className='ml-1' />
                        </a>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login