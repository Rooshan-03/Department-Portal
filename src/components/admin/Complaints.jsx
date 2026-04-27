import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiCalendar,
    FiTag,
    FiArrowRight,
    FiRefreshCw,
    FiFileText,
    FiX,
    FiCheck,
    FiUser,
    FiMail,
    FiPhone,
    FiMessageSquare,
    FiSlash,
    FiArchive,
    FiInfo,
    FiBookOpen,
    FiThumbsUp,
    FiThumbsDown,
    FiClock as FiClockIcon
} from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { getAllComplaints, updateComplaintStatus } from '../../services/apiServices';
import { MdCheckCircleOutline, MdClose } from 'react-icons/md';
import Loader from '../Loader';
import { ComplaintsLoader } from '../ComplaintLoader';

const Complaints = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.admin.adminData.access_token);
    const { allComplaints, loading, error, success } = useSelector((state) => state.admin);

    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    useEffect(() => {
        if (error || success) {
            const clearTimer = setTimeout(() => {
                dispatch(clearRecord());
            }, 4000);
            return () => clearTimeout(clearTimer);
        }
    }, [error, success, dispatch]);


    useEffect(() => {
        const fetchComplaints = async () => {
            await getAllComplaints(token, dispatch);
        };
        fetchComplaints();
    }, [token, dispatch]);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved':
                return <FiCheckCircle className="text-green-500" />;
            case 'in-progress':
                return <FiClock className="text-yellow-500" />;
            case 'rejected':
                return <FiSlash className="text-red-500" />;
            case 'closed':
                return <FiArchive className="text-gray-500" />;
            default:
                return <FiAlertCircle className="text-orange-500" />;
        }
    };

    const getMessage = (msg) => {
        if (typeof msg === 'object' && msg !== null) return msg.message || msg.detail || JSON.stringify(msg);
        return msg;
    };


    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-orange-100 text-orange-800';
        }
    };

    const getStatusBadgeIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved':
                return <FiCheck className="h-3 w-3" />;
            case 'in-progress':
                return <FiClockIcon className="h-3 w-3" />;
            case 'rejected':
                return <FiThumbsDown className="h-3 w-3" />;
            case 'closed':
                return <FiArchive className="h-3 w-3" />;
            default:
                return <FiInfo className="h-3 w-3" />;
        }
    };

    const handleViewDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setSelectedStatus(complaint.status || 'pending');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedComplaint(null);
        setSelectedStatus('');
        setShowSuccessMessage(false);
    };

    const handleUpdateStatus = async () => {
        if (!selectedComplaint || selectedStatus === selectedComplaint.status) {
            return;
        }

        setUpdatingStatus(true);
        try {
            await updateComplaintStatus(
                {
                    complaintId: selectedComplaint.id,
                    newStatus: selectedStatus,
                    token: token
                },
                dispatch
            );

            await getAllComplaints(token, dispatch);
            setShowSuccessMessage(true);
            setTimeout(() => {
                handleCloseModal();
            }, 1500);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return <ComplaintsLoader/>;
    }

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FiFileText className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">All Complaints</h1>
                    </div>
                    <p className="text-gray-500 ml-11">View and manage all customer complaints</p>
                </div>

                {/* Complaints Grid */}
                {!allComplaints || allComplaints.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <FiFileText className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">No complaints found</h3>
                        <p className="mt-2 text-gray-500">There are no complaints to display at this time.</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Summary with all 5 statuses */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {allComplaints.filter(c => c.status?.toLowerCase() === 'pending' || !c.status).length}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">In Progress</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {allComplaints.filter(c => c.status?.toLowerCase() === 'in-progress').length}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Resolved</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {allComplaints.filter(c => c.status?.toLowerCase() === 'resolved').length}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Rejected</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {allComplaints.filter(c => c.status?.toLowerCase() === 'rejected').length}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Closed</p>
                                <p className="text-2xl font-bold text-gray-600">
                                    {allComplaints.filter(c => c.status?.toLowerCase() === 'closed').length}
                                </p>
                            </div>
                        </div>

                        {/* Complaints Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {allComplaints.map((complaint, index) => (
                                <div
                                    key={complaint.id || index}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-blue-200 group cursor-pointer"
                                    onClick={() => handleViewDetails(complaint)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(complaint.status)}
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status || 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                            {complaint.title || `Complaint #${complaint.id || index + 1}`}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {complaint.description || 'No description provided'}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                            {complaint.createdAt && (
                                                <div className="flex items-center gap-1">
                                                    <FiCalendar className="h-3 w-3" />
                                                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {complaint.category && (
                                                <div className="flex items-center gap-1">
                                                    <FiTag className="h-3 w-3" />
                                                    <span>{complaint.category}</span>
                                                </div>
                                            )}
                                        </div>

                                        <button className="mt-2 text-blue-600 hover:text-blue-700 cursor-pointer font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                            View Details
                                            <FiArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Enhanced Modal */}
            {isModalOpen && selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop with blur */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
                        onClick={handleCloseModal}
                    ></div>

                    {/* Modal Container */}
                    <div className="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
                        {/* Success Message Overlay */}
                        {showSuccessMessage && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                                <div className="text-center animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FiCheck className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-green-800 mb-2">Status Updated!</h3>
                                    <p className="text-gray-600">The complaint status has been successfully updated.</p>
                                </div>
                            </div>
                        )}

                        {/* Modal Header with Gradient */}
                        <div className="bg-gradient-to-r from-primary-hover to-primary rounded-t-2xl px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <FiBookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">
                                        Complaint Details
                                    </h3>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <FiX className="h-6 w-6 cursor-pointer" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex justify-start">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedComplaint.status)}`}>
                                    {getStatusBadgeIcon(selectedComplaint.status)}
                                    <span>Current Status: {selectedComplaint.status || 'Pending'}</span>
                                </div>
                            </div>

                            {/* Title Section */}
                            <div className="border-b border-gray-100 pb-4">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</label>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {selectedComplaint.title || 'N/A'}
                                </p>
                            </div>

                            {/* Description Section */}
                            <div className="border-b border-gray-100 pb-4">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <FiMessageSquare className="h-3 w-3" />
                                    Description
                                </label>
                                <div className="mt-2 bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 leading-relaxed">
                                        {selectedComplaint.description || 'No description provided'}
                                    </p>
                                </div>
                            </div>



                            {/* Update Status Section */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                                    <FiRefreshCw className="h-4 w-4 text-primary" />
                                    Update Complaint Status
                                </label>

                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent transition-all"
                                            disabled={updatingStatus}
                                        >
                                            <option value="pending">    Pending</option>
                                            <option value="in-progress">    In Progress</option>
                                            <option value="resolved">    Resolved</option>
                                            <option value="rejected">    Rejected</option>
                                            <option value="closed">    Closed</option>
                                        </select>

                                        <button
                                            onClick={handleUpdateStatus}
                                            disabled={updatingStatus || selectedStatus === selectedComplaint.status}
                                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${updatingStatus || selectedStatus === selectedComplaint.status
                                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                                : 'bg-primary hover:bg-primary-hover cursor-pointer text-white shadow-md hover:shadow-lg'
                                                }`}
                                        >
                                            {updatingStatus ? (
                                                <>
                                                    <FaSpinner className="animate-spin h-4 w-4" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <FiCheck className="h-4 w-4" />
                                                    Update Status
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Status Change Indicator */}
                                    {selectedStatus !== selectedComplaint.status && selectedStatus && (
                                        <div className="flex items-center gap-2 text-sm text-primary bg-background rounded-lg px-3 py-2">
                                            <FiArrowRight className="h-3 w-3" />
                                            <span>Changing status from <strong>{selectedComplaint.status || 'Pending'}</strong> to <strong>{selectedStatus}</strong></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints;