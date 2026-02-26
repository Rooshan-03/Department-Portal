import React, { useState, useEffect } from 'react';
import '../index.css';
import department from '../assets/Department.png';
import { FaGraduationCap, FaUserEdit } from 'react-icons/fa';
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
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(300);

    const tabs = ['Student', 'Teacher', 'Admin'];

    // --- Fixed Effects ---
    
    // Auto-clear logic for both error and success
    useEffect(() => {
        let clearTimer;
        if (error || success) {
            clearTimer = setTimeout(() => {
                dispatch(clearRecord());
            }, 5000);
        }
        return () => clearTimeout(clearTimer);
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

    // Helper to extract message string from potential backend objects
    const getMessage = (msg) => {
        if (typeof msg === 'object' && msg !== null) {
            return msg.detail || msg.message || JSON.stringify(msg);
        }
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

    const handleFeedbackClose = () => {
        dispatch(clearRecord());
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
        try {
            await register({ ...registerData, role: activeTab.toLowerCase() }, dispatch);
            setStep('otp');
            setTimer(300); 
        } catch (err) {}
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        await verifyOTP({ email: registerData.email, otp }, dispatch);
    };

    const handleResend = async () => {
        if (timer > 0) return;
        await resendOTP({ email: registerData.email }, dispatch);
        setTimer(300);
        setOtp('');
    };

    return (
        <div className='flex flex-col lg:flex-row h-screen bg-gray-200 w-screen overflow-hidden font-sans relative'>
            
            {/* 1. FIXED LOADING OVERLAY */}
            {loading && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a5f] rounded-full animate-spin"></div>
                    <p className="mt-4 text-[#1e3a5f] font-bold tracking-widest text-sm animate-pulse uppercase">Processing...</p>
                </div>
            )}

            {/* 2. FIXED NOTIFICATIONS CONTAINER */}
           {/* FIXED NOTIFICATIONS CONTAINER */}
<div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] w-full max-w-md px-4 pointer-events-none">
    {error && (
        <div className="bg-white border-l-4 border-red-500 rounded-xl shadow-2xl overflow-hidden mb-4 animate-in slide-in-from-top duration-300 pointer-events-auto">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <MdErrorOutline className="text-red-500 text-2xl mr-3 flex shrink-0" />
                    <p className="text-red-800 text-sm font-semibold">{getMessage(error)}</p>
                </div>
                <button onClick={handleFeedbackClose} className="ml-4 p-1 hover:bg-red-50 rounded-full text-red-400">
                    <MdClose size={20} />
                </button>
            </div>
            <div className="h-1 bg-red-100 w-full">
                <div className="h-full bg-red-500 animate-shrink origin-left"></div>
            </div>
        </div>
    )}

    {success && (
        <div className="bg-white border-l-4 border-green-500 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top duration-300 pointer-events-auto">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <MdCheckCircleOutline className="text-green-500 text-2xl mr-3 flex shrink-0" />
                    <p className="text-green-800 text-sm font-semibold">{getMessage(success)}</p>
                </div>
                <button onClick={handleFeedbackClose} className="ml-4 p-1 hover:bg-green-50 rounded-full text-green-400">
                    <MdClose size={20} />
                </button>
            </div>
            <div className="h-1 bg-green-100 w-full">
                <div className="h-full bg-green-500 animate-shrink origin-left" style={{ animationDuration: '5s' }}></div>
            </div>
        </div>
    )}
</div>

            {/* Left Section */}
            <div className="hidden lg:block relative h-screen lg:w-[40%] overflow-hidden">
                <img src={department} alt="University" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f] via-[#1e3a5f]/80 to-transparent opacity-80"></div>
                <div className='absolute top-8 left-8 flex items-center text-white'>
                    <FaGraduationCap className="text-5xl mr-4" />
                    <h2 className="text-3xl font-bold leading-tight uppercase tracking-tighter">University Of Sargodha</h2>
                </div>
            </div>

            {/* Right Section */}
            <div className='w-full lg:w-[60%] h-screen flex items-center justify-center p-4 perspective-1000'>
                {step === 'otp' ? (
                    <div className='bg-white w-full max-w-md shadow-2xl flex flex-col items-center rounded-3xl p-8 md:p-12 animate-in zoom-in duration-500'>
                        <div className='bg-blue-50 w-16 h-16 mb-6 flex items-center justify-center rounded-2xl'>
                            <MdOutlineMarkEmailRead className='w-9 h-9 text-[#1e3a5f]' />
                        </div>
                        <div className='text-center mb-8'>
                            <h1 className='text-slate-800 text-2xl font-bold uppercase tracking-tight'>Verify OTP</h1>
                            <p className='text-slate-400 text-sm font-medium mt-2 leading-relaxed'>
                                Code sent to <span className="text-[#1e3a5f] font-bold">{registerData.email}</span>
                            </p>
                        </div>
                        <form className='w-full space-y-6' onSubmit={handleVerifyOTP}>
                            <input 
                                type="text" 
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                maxLength={6}
                                className='w-full text-center text-3xl tracking-[1rem] font-bold py-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-400 focus:bg-blue-50/30 transition-all'
                                required
                            />
                            <div className='text-center'>
                                <p className={`text-sm font-bold ${timer > 0 ? 'text-slate-400' : 'text-red-500'}`}>
                                    {timer > 0 ? `Code expires in: ${formatTime(timer)}` : "OTP has expired"}
                                </p>
                            </div>
                            <button className='w-full bg-[#1e3a5f] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#152943] transition-all uppercase tracking-widest text-sm disabled:opacity-50' disabled={otp.length < 4}>
                                Verify Account
                            </button>
                        </form>
                        <div className='mt-8 flex flex-col items-center space-y-4'>
                            <button onClick={handleResend} disabled={timer > 0} className={`text-xs font-bold uppercase tracking-widest transition-all ${timer > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-[#1e3a5f] hover:underline'}`}>
                                {timer > 0 ? `Resend available in ${timer}s` : "Resend New Code"}
                            </button>
                            <button onClick={() => setStep('auth')} className='flex items-center text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest'>
                                <MdOutlineArrowBack className='mr-2' /> Edit Email
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`relative w-full max-w-lg transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* FRONT: LOGIN */}
                        <div className='bg-white w-full shadow-2xl flex flex-col items-center rounded-3xl p-8 md:p-12 backface-hidden'>
                            <div className='bg-blue-50 w-14 h-14 mb-6 flex items-center justify-center rounded-xl'>
                                <MdSecurity className='w-8 h-8 text-[#1e3a5f]' />
                            </div>
                            <div className='text-center mb-8'>
                                <h1 className='text-slate-800 text-2xl font-bold uppercase tracking-tight'>{activeTab} Login</h1>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                                {tabs.map((tab) => (
                                    <button key={tab} onClick={() => { setActiveTab(tab); setIsFlipped(false); }} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <form className='w-full space-y-4' onSubmit={handleLogin}>
                                <div className='relative'>
                                    <MdOutlineMail className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg' />
                                    <input name="email" type="email" value={loginData.email} onChange={handleLoginChange} placeholder="Email" className='w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400' required />
                                </div>
                                <div className='relative'>
                                    <MdOutlineLock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl' />
                                    <input name="password" type={showPass ? "text" : "password"} value={loginData.password} onChange={handleLoginChange} placeholder='Password' className='w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-400' required />
                                    <div onClick={() => setShowPass(!showPass)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer'>
                                        {showPass ? <MdOutlineRemoveRedEye size={20} /> : <MdOutlineVisibilityOff size={20} />}
                                    </div>
                                </div>
                                <button className='w-full bg-[#1e3a5f] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#152943] transition-all uppercase tracking-widest text-sm'>Sign In</button>
                            </form>
                            <div className='w-full mt-10 pt-6 border-t border-slate-100 flex items-center justify-between'>
                                <span className='text-xs font-semibold text-slate-400'>{activeTab === 'Admin' ? "System Admin?" : "Don't have an account?"}</span>
                                <button onClick={handleFlip} className='flex items-center text-xs font-bold text-[#1e3a5f] hover:translate-x-1 transition-transform'>
                                    {activeTab === 'Admin' ? "Contact Dev" : "Register Now"} <HiOutlineArrowRight className='ml-1' />
                                </button>
                            </div>
                        </div>

                        {/* BACK: REGISTRATION */}
                        <div className='absolute inset-0 bg-white w-full shadow-2xl flex flex-col items-center rounded-3xl p-8 md:p-12 backface-hidden rotate-y-180'>
                            {activeTab === 'Admin' ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <MdSecurity className="text-5xl text-red-600 mb-6" />
                                    <h2 className="text-2xl font-bold text-slate-800 uppercase">Access Restricted</h2>
                                    <div className='flex flex-col w-full space-y-3 mt-8'>
                                        <a href={`https://wa.me/${wNumber}`} className="bg-[#25D366] text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs">WhatsApp</a>
                                        <a href={`mailto:${eAddress}`} className="bg-[#1e3a5f] text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Email</a>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <MdOutlinePersonAddAlt className='w-10 h-10 text-[#1e3a5f] mb-4' />
                                    <h1 className='text-slate-800 text-2xl font-bold uppercase mb-6'>{activeTab} Registration</h1>
                                    <form className='w-full space-y-4' onSubmit={handleRegistration}>
                                        <input name="name" type="text" value={registerData.name} onChange={handleRegisterChange} placeholder="Full Name" className='w-full px-4 py-3 border border-slate-200 rounded-xl' required />
                                        <input name="email" type="email" value={registerData.email} onChange={handleRegisterChange} placeholder="Email" className='w-full px-4 py-3 border border-slate-200 rounded-xl' required />
                                        <input name="password" type="password" value={registerData.password} onChange={handleRegisterChange} placeholder="Password" className='w-full px-4 py-3 border border-slate-200 rounded-xl' required />
                                        <input name="confirmPassword" type="password" value={registerData.confirmPassword} onChange={handleRegisterChange} placeholder="Confirm" className='w-full px-4 py-3 border border-slate-200 rounded-xl' required />
                                        <button className='w-full bg-[#1e3a5f] text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm'>Create Account</button>
                                    </form>
                                </>
                            )}
                            <button onClick={handleFlip} className='mt-auto flex items-center text-xs font-bold text-slate-400 hover:text-[#1e3a5f] transition-colors'>
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