import React, { useState } from 'react';
import '../index.css';
import department from '../assets/Department.png';
import { FaGraduationCap, FaRegAddressCard, FaUserEdit, FaFingerprint } from 'react-icons/fa';
import { MdSecurity, MdOutlineLock, MdOutlineRemoveRedEye, MdOutlinePersonAddAlt, MdOutlineMail, MdClose, MdErrorOutline, MdOutlineArrowBack, MdOutlineVisibilityOff } from 'react-icons/md';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { loginAdmin, registerAdmin } from '../services/apiServices';
import { useDispatch, useSelector } from 'react-redux';
import { clearRecord } from '../Redux/admin';
import { useEffect } from 'react';

function Login() {
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.admin);

    const [activeTab, setActiveTab] = useState('Student');
    const [isFlipped, setIsFlipped] = useState(false);


    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);


    const [loginData, setLoginData] = useState({ email: '', password: '', secretId: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });


    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearRecord()); // Or { type: 'auth/clearError' }
            }, 4000); // 4 seconds

            return () => clearTimeout(timer); // Cleanup timer if component unmounts
        }
    }, [error, dispatch]);


    const tabs = ['Student', 'Faculty', 'Admin'];

    const handleFlip = (e) => {
        e.preventDefault();
        setIsFlipped(!isFlipped);
    };


    const handleErrorClose = () => {
        dispatch(clearRecord());
    };

    const handleLoginChange = async (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });



    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };


    const handleLogin = async (e) => {
        e.preventDefault();

        const data = {
            email: loginData.email,
            password: loginData.password
        };

        if (activeTab === 'Admin') {
            await loginAdmin(e, data, dispatch);
        } else if (activeTab === 'Faculty') {
            console.log("Faculty Login logic here");
        } else {
            console.log("Student Login logic here");
        }
    };

    const HandleRegistration = async (e) => {
        e.preventDefault();
        const data = {
            name: registerData.name,
            email: registerData.email,
            password: registerData.password,
            role: 'Admin'
        };
        await registerAdmin(e,data,dispatch)
        setIsFlipped(false)
    }

    return (
        <div className='flex flex-col lg:flex-row h-screen bg-gray-200 w-screen overflow-hidden'>

            {loading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a5f] rounded-full animate-spin"></div>
                    <p className="mt-4 text-[#1e3a5f] font-bold tracking-widest text-sm animate-pulse">AUTHENTICATING...</p>
                </div>
            )}

            {/* Left Section - Image */}
            <div className="hidden lg:block relative h-screen lg:w-[40%] overflow-hidden">
                <img src={department} alt="University" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f] via-[#1e3a5f]/80 to-transparent opacity-80"></div>
                <div className='absolute top-8 left-8 flex items-center text-white'>
                    <FaGraduationCap className="text-5xl mr-4" />
                    <h2 className="text-3xl font-bold leading-tight">University Of<br />Sargodha</h2>
                </div>
                <div className="absolute bottom-8 left-8 text-white/70 text-sm font-medium tracking-widest uppercase">
                    Established 2002
                </div>
            </div>

            {/* Right Section - Animated Container */}
            <div className='w-full lg:w-[60%] h-screen flex items-center justify-center p-4 perspective-1000'>
                {error && (
                    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md bg-white border-l-4 border-red-500 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-all">
                        {/* Main Content Area */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <MdErrorOutline className="text-red-500 text-2xl mr-3 flex-shrink-0" />
                                <p className="text-red-800 text-sm font-semibold">{error}</p>
                            </div>
                            <button
                                onClick={handleErrorClose}
                                className="ml-4 p-1 hover:bg-red-50 rounded-full text-red-400 hover:text-red-600 transition-colors"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>

                        {/* Progress Bar - This sits at the very bottom edge */}
                        <div className="h-1.5 bg-red-100 w-full">
                            <div className="h-full bg-red-500 animate-shrink origin-left"></div>
                        </div>
                    </div>
                )}
                <div className={`relative w-full max-w-lg transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                    {/* --- FRONT SIDE: LOGIN --- */}
                    <div className='bg-white w-full shadow-2xl flex flex-col items-center rounded-3xl p-8 md:p-12 backface-hidden'>
                        <div className='bg-blue-50 w-14 h-14 mb-6 flex items-center justify-center rounded-xl'>
                            <MdSecurity className='w-8 h-8 text-[#1e3a5f]' />
                        </div>

                        {/* Top Welcome Text */}
                        <div className='text-center mb-8'>
                            <h1 className='text-slate-800 text-2xl md:text-3xl font-bold uppercase tracking-tight'>Welcome Back!</h1>
                            <p className='text-slate-400 text-sm font-medium mt-1'>
                                Please Enter your credentials to access dashboard
                            </p>
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                            {tabs.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <form className='w-full space-y-4' onSubmit={handleLogin}>
                            {/* ID Input */}
                            <div>
                                <label className='block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>{activeTab} ID / Email</label>
                                <div className='relative'>
                                    <FaRegAddressCard className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg' />
                                    <input name="email" type="text" value={loginData.id} onChange={handleLoginChange} placeholder={`Enter ${activeTab} ID`} className='w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 placeholder:text-slate-300' />
                                </div>
                            </div>

                            {/* Secret ID - Shown for Student and Faculty */}
                            {activeTab !== 'Admin' && (
                                <div>
                                    <label className='block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>Secret Access Key</label>
                                    <div className='relative'>
                                        <FaFingerprint className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg' />
                                        <input name="secretId" type="password" value={loginData.secretId} onChange={handleLoginChange} placeholder="Enter Secret Code" className='w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 placeholder:text-slate-300' />
                                    </div>
                                </div>
                            )}

                            {/* Password */}
                            <div>
                                <div className='flex justify-between mb-1'>
                                    <label className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>Password</label>
                                    <a href='#' className='text-[10px] font-bold text-slate-700 hover:underline'>Forgot Password?</a>
                                </div>
                                <div className='relative'>
                                    <MdOutlineLock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl' />
                                    <input name="password" type={showPass ? "text" : "password"} value={loginData.password} onChange={handleLoginChange} placeholder='••••••••' className='w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400' />
                                    <div onClick={() => setShowPass(!showPass)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer hover:text-blue-600 transition-colors'>
                                        {showPass ? <MdOutlineRemoveRedEye size={20} /> : <MdOutlineVisibilityOff size={20} />}
                                    </div>
                                </div>
                            </div>

                            <button className='w-full bg-[#1e3a5f] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#152943] transition-all uppercase tracking-widest text-sm mt-2'>Sign In Securely</button>
                        </form>

                        {/* Footer Info */}
                        <div className='w-full mt-10 pt-6 border-t border-slate-100 flex items-center justify-between'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-blue-50 p-2 rounded-full'>
                                    <MdOutlinePersonAddAlt className='text-blue-600' />
                                </div>
                                <span className='text-xs font-semibold text-slate-400'>
                                    {activeTab === 'Admin' ? "Don't Have an account?" : activeTab === 'Faculty' ? "Looking to Join?" : "New admission?"}
                                </span>
                            </div>
                            {activeTab === 'Admin' ? (
                                <button onClick={handleFlip} className='flex items-center text-xs font-bold text-[#1e3a5f] hover:translate-x-1 transition-transform cursor-pointer'>
                                    Register Now <HiOutlineArrowRight className='ml-1' />
                                </button>
                            ) : (
                                <a
                                    href={`https://wa.me/923247692198?text=Hi, I am a ${activeTab} and I need help.`}
                                    target="_blank"
                                    className='flex items-center text-xs font-bold text-[#1e3a5f] hover:translate-x-1 transition-transform'>
                                    Contact {activeTab === 'Faculty' ? 'HR' : 'Registrar'} <HiOutlineArrowRight className='ml-1' />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* --- BACK SIDE: REGISTER --- */}
                    <div className='absolute inset-0 bg-white w-full shadow-2xl flex flex-col items-center rounded-3xl p-8 md:p-12 backface-hidden rotate-y-180'>
                        <div className='bg-blue-50 p-3 rounded-xl mb-4'>
                            <MdOutlinePersonAddAlt className='w-8 h-8 text-[#1e3a5f]' />
                        </div>

                        <div className='text-center mb-8'>
                            <h1 className='text-slate-800 text-2xl md:text-3xl font-bold uppercase tracking-tight'>Admin Registration</h1>
                            <p className='text-slate-400 text-sm font-medium mt-1'>Create your administrative account</p>
                        </div>

                        <form className='w-full space-y-4'>
                            <div className='relative'>
                                <FaUserEdit className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg' />
                                <input name="name" type="text" value={registerData.name} onChange={handleRegisterChange} placeholder="Full Name" className='w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all' />
                            </div>
                            <div className='relative'>
                                <MdOutlineMail className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl' />
                                <input name="email" type="email" value={registerData.email} onChange={handleRegisterChange} placeholder="Email Address" className='w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all' />
                            </div>

                            {/* Registration Password */}
                            <div className='relative'>
                                <MdOutlineLock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl' />
                                <input name="password" type={showPass ? "text" : "password"} value={registerData.password} onChange={handleRegisterChange} placeholder="Password" className='w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all' />
                                <div onClick={() => setShowPass(!showPass)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer hover:text-blue-600 transition-colors'>
                                    {showPass ? <MdOutlineRemoveRedEye size={20} /> : <MdOutlineVisibilityOff size={20} />}
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className='relative'>
                                <MdOutlineLock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl' />
                                <input name="confirmPassword" type={showConfirmPass ? "text" : "password"} value={registerData.confirmPassword} onChange={handleRegisterChange} placeholder="Confirm Password" className='w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all' />
                                <div onClick={() => setShowConfirmPass(!showConfirmPass)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer hover:text-blue-600 transition-colors'>
                                    {showConfirmPass ? <MdOutlineRemoveRedEye size={20} /> : <MdOutlineVisibilityOff size={20} />}
                                </div>
                            </div>

                            <button
                                onClick={HandleRegistration}
                                className='w-full bg-[#1e3a5f] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#152943] transition-all uppercase tracking-widest text-sm mt-4'>Create Account</button>
                        </form>

                        <button onClick={handleFlip} className='mt-8 flex items-center text-xs font-bold text-slate-400 hover:text-[#1e3a5f] transition-colors uppercase tracking-widest cursor-pointer'>
                            <MdOutlineArrowBack className='mr-2 text-lg' /> Back to Login
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;