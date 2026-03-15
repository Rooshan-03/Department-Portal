import React, { useState, useEffect } from 'react';
import '../index.css';
import department from '../assets/Department.png';
import { FaGraduationCap } from 'react-icons/fa';
import {
    MdSecurity, MdOutlineLock, MdOutlineRemoveRedEye,
    MdOutlinePersonAddAlt, MdOutlineMail, MdClose,
    MdErrorOutline, MdOutlineArrowBack, MdOutlineVisibilityOff,
    MdOutlineMarkEmailRead, MdCheckCircleOutline
} from 'react-icons/md';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { login, register, verifyOTP, resendOTP } from '../services/apiServices';
import { useDispatch, useSelector } from 'react-redux';
import { clearRecord, setError } from '../Redux/admin';
import { useNavigate } from 'react-router-dom';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const eAddress = import.meta.env.VITE_EMAIL_ADDRESS;
    const { loading, error, success } = useSelector((state) => state.admin);

    const [step, setStep] = useState('auth');
    const [activeTab, setActiveTab] = useState('Student');
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Password visibility states
    const [showLoginPass, setShowLoginPass] = useState(false);
    const [showRegPass, setShowRegPass] = useState(false);
    const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(300);

    const tabs = ['Student', 'Teacher', 'Admin'];

    useEffect(() => {
        if (error || success) {
            const clearTimer = setTimeout(() => {
                dispatch(clearRecord());
            }, 4000);
            return () => clearTimeout(clearTimer);
        }
    }, [error, success, dispatch]);

    useEffect(() => {
        let interval = null;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const getMessage = (msg) => {
        if (typeof msg === 'object' && msg !== null) return msg.message || msg.detail || JSON.stringify(msg);
        return msg;
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleFlip = (e) => {
        e.preventDefault();
        setIsFlipped(!isFlipped);
    };

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        await login({ ...loginData, role: activeTab.toLowerCase() }, dispatch, navigate);
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            dispatch(setError("Passwords do not match"));
            return;
        }
        await register({ ...registerData, role: activeTab.toLowerCase() }, dispatch);
        setStep('otp');
        setTimer(300);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        await verifyOTP({ email: registerData.email, otp }, dispatch);
        
        setStep('auth');     
        setIsFlipped(false); 
        setOtp('');          
    
    };

    const handleResend = async () => {
        if (timer > 0) return;
        await resendOTP({ email: registerData.email }, dispatch);
        setTimer(300);
        setOtp('');
    };

    return (
        <div className='flex flex-col lg:flex-row h-screen bg-gray-200 w-screen overflow-hidden font-sans relative'>

            {loading && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a5f] rounded-full animate-spin"></div>
                    <p className="mt-4 text-[#1e3a5f] font-bold tracking-widest text-sm animate-pulse uppercase">Processing...</p>
                </div>
            )}

            {/* NOTIFICATIONS - TOP RIGHT OVERLAY */}
            <div className="fixed top-6 right-1 z-[999] w-full max-w-sm pointer-events-none flex flex-col gap-3">
                {error && (
                    <div className="bg-white border-l-4 border-red-500 rounded-xl shadow-2xl overflow-hidden pointer-events-auto animate-in slide-in-from-left duration-300">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <MdErrorOutline className="text-red-500 text-xl mr-3 flex-shrink-0" />
                                <p className="text-red-800 text-xs font-semibold leading-tight">
                                    {getMessage(error)}
                                </p>
                            </div>
                            <button
                                onClick={() => dispatch(clearRecord())}
                                className="ml-4 text-red-300 hover:text-red-600 transition-colors"
                            >
                                <MdClose size={18} />
                            </button>
                        </div>
                        {/* Error Progress Bar */}
                        <div className="h-1 bg-red-50 w-full">
                            <div className="h-full bg-red-500 animate-shrink"></div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-white border-l-4 border-green-500 rounded-xl shadow-2xl overflow-hidden pointer-events-auto animate-in slide-in-from-left duration-300">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <MdCheckCircleOutline className="text-green-500 text-xl mr-3 flex-shrink-0" />
                                <p className="text-green-800 text-xs font-semibold leading-tight">
                                    {getMessage(success)}
                                </p>
                            </div>
                            <button
                                onClick={() => dispatch(clearRecord())}
                                className="ml-4 text-green-300 hover:text-green-600 transition-colors"
                            >
                                <MdClose size={18} />
                            </button>
                        </div>
                        {/* Success Progress Bar */}
                        <div className="h-1 bg-green-50 w-full">
                            <div className="h-full bg-green-500 animate-shrink"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Left Brand Section - Responsive */}
            <div className="hidden lg:block relative h-screen lg:w-[40%]">
                <img src={department} alt="University" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f] to-transparent opacity-80"></div>
                <div className='absolute top-8 left-8 flex items-center text-white'>
                    <FaGraduationCap className="text-4xl md:text-5xl mr-4" />
                    <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter">University Of Sargodha</h2>
                </div>
            </div>

            {/* Right Form Section - Responsive */}
            <div className='w-full lg:w-[60%] h-screen flex items-center justify-center p-2 sm:p-4 perspective-1000 overflow-y-auto'>
                {step === 'otp' ? (
                    <div className='bg-white w-full max-w-md shadow-2xl flex flex-col items-center rounded-3xl p-6 sm:p-8 md:p-12 animate-in zoom-in duration-300 mx-2'>
                        <div className='bg-blue-50 w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-6 flex items-center justify-center rounded-2xl'>
                            <MdOutlineMarkEmailRead className='w-7 h-7 sm:w-9 sm:h-9 text-[#1e3a5f]' />
                        </div>
                        <div className='text-center mb-6 sm:mb-8'>
                            <h1 className='text-slate-800 text-xl sm:text-2xl font-bold uppercase'>Verify OTP</h1>
                            <p className='text-slate-400 text-xs sm:text-sm mt-2'>Code sent to <span className="text-[#1e3a5f] font-bold break-all">{registerData.email}</span></p>
                        </div>
                        <form className='w-full space-y-4 sm:space-y-6' onSubmit={handleVerifyOTP}>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                maxLength={6}
                                placeholder="000000"
                                className='w-full text-center text-2xl sm:text-3xl tracking-[0.5rem] sm:tracking-[1rem] font-bold py-3 sm:py-4 border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:border-blue-400 outline-none transition-all'
                                required
                            />
                            <div className='text-center'>
                                <p className={`text-xs sm:text-sm font-bold ${timer > 0 ? 'text-slate-400' : 'text-red-500'}`}>
                                    {timer > 0 ? `Expires in: ${formatTime(timer)}` : "OTP Expired"}
                                </p>
                            </div>
                            <button className='w-full bg-[#1e3a5f] text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg hover:bg-[#152943] uppercase tracking-widest text-xs sm:text-sm disabled:opacity-50' disabled={otp.length < 4 || loading}>
                                {loading ? "Verifying..." : "Verify Account"}
                            </button>
                        </form>
                        <div className='mt-6 sm:mt-8 flex flex-col items-center space-y-3 sm:space-y-4'>
                            <button
                                onClick={handleResend}
                                disabled={timer > 0 || loading}
                                className={`text-xs font-bold uppercase tracking-widest ${timer > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-[#1e3a5f] hover:underline'}`}
                            >
                                {timer > 0 ? `Resend in ${timer}s` : "Resend New Code"}
                            </button>
                            <button onClick={() => setStep('auth')} className='flex items-center text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest'>
                                <MdOutlineArrowBack className='mr-2' /> Edit Email
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`relative w-full max-w-lg transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Login Card */}
                        <div className='bg-white w-full shadow-2xl flex flex-col items-center rounded-3xl p-6 sm:p-8 md:p-12 backface-hidden'>
                            <div className='bg-blue-50 w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 flex items-center justify-center rounded-xl'>
                                <MdSecurity className='w-6 h-6 sm:w-8 sm:h-8 text-[#1e3a5f]' />
                            </div>
                            <h1 className='text-slate-800 text-xl sm:text-2xl font-bold uppercase mb-4 sm:mb-8'>{activeTab} Login</h1>
                            
                            {/* Tabs - Responsive */}
                            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 sm:mb-8 w-full max-w-xs mx-auto">
                                {tabs.map((tab) => (
                                    <button 
                                        key={tab} 
                                        onClick={() => setActiveTab(tab)} 
                                        className={`flex-1 px-2 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            
                            <form className='w-full space-y-3 sm:space-y-4' onSubmit={handleLogin}>
                                <div className='relative'>
                                    <MdOutlineMail className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg sm:text-xl' />
                                    <input 
                                        name="email" 
                                        type="email" 
                                        value={loginData.email} 
                                        onChange={handleLoginChange} 
                                        placeholder="Email" 
                                        className='w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:border-blue-400 outline-none text-sm sm:text-base' 
                                        required 
                                    />
                                </div>
                                <div className='relative'>
                                    <MdOutlineLock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg sm:text-xl' />
                                    <input 
                                        name="password" 
                                        type={showLoginPass ? "text" : "password"} 
                                        value={loginData.password} 
                                        onChange={handleLoginChange} 
                                        placeholder='Password' 
                                        className='w-full pl-10 pr-12 py-2 sm:py-3 border border-slate-200 rounded-xl focus:border-blue-400 outline-none text-sm sm:text-base' 
                                        required 
                                    />
                                    <div 
                                        onClick={() => setShowLoginPass(!showLoginPass)} 
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-[#1e3a5f] transition-colors'
                                    >
                                        {showLoginPass ? <MdOutlineRemoveRedEye size={20} /> : <MdOutlineVisibilityOff size={20} />}
                                    </div>
                                </div>
                                <button className='w-full bg-[#1e3a5f] text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg hover:bg-[#152943] uppercase tracking-widest text-xs sm:text-sm'>
                                    Sign In
                                </button>
                            </form>
                            
                            <div className='w-full mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-100 flex items-center justify-between'>
                                <span className='text-xs font-semibold text-slate-400'>{activeTab === 'Admin' ? "System Admin?" : "New here?"}</span>
                                <button onClick={handleFlip} className='flex items-center text-xs font-bold text-[#1e3a5f] hover:translate-x-1 transition-transform'>
                                    {activeTab === 'Admin' ? "Contact Support" : "Create Account"} <HiOutlineArrowRight className='ml-1' />
                                </button>
                            </div>
                        </div>

                        {/* Registration Card */}
                        <div className='absolute inset-0 bg-white w-full shadow-2xl flex flex-col items-center rounded-3xl p-6 sm:p-8 md:p-12 backface-hidden rotate-y-180 overflow-y-auto max-h-full'>
                            {activeTab === 'Admin' ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <MdSecurity className="text-4xl sm:text-5xl text-red-600 mb-4 sm:mb-6" />
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">Admin Registration Restricted</h2>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">Please contact support for admin access</p>
                                    <div className='flex flex-col w-full space-y-3 mt-4'>
                                        <a 
                                            href={`https://wa.me/${wNumber}`} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#25D366] text-white py-3 rounded-xl font-bold uppercase text-xs hover:bg-[#128C7E] transition-colors"
                                        >
                                            Contact via WhatsApp
                                        </a>
                                        <a 
                                            href={`mailto:${eAddress}`}
                                            className="bg-[#1e3a5f] text-white py-3 rounded-xl font-bold uppercase text-xs hover:bg-[#152943] transition-colors"
                                        >
                                            Send Email
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <MdOutlinePersonAddAlt className='w-8 h-8 sm:w-10 sm:h-10 text-[#1e3a5f] mb-3 sm:mb-4' />
                                    <h1 className='text-slate-800 text-xl sm:text-2xl font-bold uppercase mb-4 sm:mb-6'>{activeTab} Join</h1>
                                    <form className='w-full space-y-3 sm:space-y-4' onSubmit={handleRegistration}>
                                        <input 
                                            name="name" 
                                            type="text" 
                                            value={registerData.name} 
                                            onChange={handleRegisterChange} 
                                            placeholder="Full Name" 
                                            className='w-full px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:border-blue-400 outline-none text-sm sm:text-base' 
                                            required 
                                        />
                                        <input 
                                            name="email" 
                                            type="email" 
                                            value={registerData.email} 
                                            onChange={handleRegisterChange} 
                                            placeholder="Email" 
                                            className='w-full px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:border-blue-400 outline-none text-sm sm:text-base' 
                                            required 
                                        />
                                        
                                        {/* Password field with visibility toggle */}
                                        <div className='relative'>
                                            <input 
                                                name="password" 
                                                type={showRegPass ? "text" : "password"} 
                                                value={registerData.password} 
                                                onChange={handleRegisterChange} 
                                                placeholder="Password" 
                                                className='w-full px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:border-blue-400 outline-none text-sm sm:text-base pr-12' 
                                                required 
                                            />
                                            <div 
                                                onClick={() => setShowRegPass(!showRegPass)} 
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-[#1e3a5f] transition-colors'
                                            >
                                                {showRegPass ? <MdOutlineRemoveRedEye size={20} /> : <MdOutlineVisibilityOff size={20} />}
                                            </div>
                                        </div>
                                        
                                        {/* Confirm Password field with visibility toggle */}
                                        <div className='relative'>
                                            <input 
                                                name="confirmPassword" 
                                                type={showRegConfirmPass ? "text" : "password"} 
                                                value={registerData.confirmPassword} 
                                                onChange={handleRegisterChange} 
                                                placeholder="Confirm Password" 
                                                className='w-full px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:border-blue-400 outline-none text-sm sm:text-base pr-12' 
                                                required 
                                            />
                                            <div 
                                                onClick={() => setShowRegConfirmPass(!showRegConfirmPass)} 
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-[#1e3a5f] transition-colors'
                                            >
                                                {showRegConfirmPass ? <MdOutlineRemoveRedEye size={20} /> : <MdOutlineVisibilityOff size={20} />}
                                            </div>
                                        </div>
                                        
                                        <button className='w-full bg-[#1e3a5f] text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg hover:bg-[#152943] uppercase tracking-widest text-xs sm:text-sm'>
                                            Register & Send OTP
                                        </button>
                                    </form>
                                </>
                            )}
                            <button onClick={handleFlip} className='mt-4 sm:mt-6 flex items-center text-xs font-bold text-slate-400 hover:text-[#1e3a5f] transition-colors'>
                                <MdOutlineArrowBack className='mr-2' /> Back to Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;