import React, { useEffect, useState } from 'react';
import {
    UserCheck,
    GraduationCap,
    Users,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { approveUser, declineUser } from '../../services/apiServices';
import { setSuccess, setError, clearMessages } from '../../Redux/admin';

const StatsCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 animate-pulse">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="ml-5 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
            </div>
        </div>
    </div>
);

const TableRowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </div>
                <div className="ml-4">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-24"></div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
            <div className="flex items-center justify-end space-x-2">
                <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </div>
        </td>
    </tr>
);

const AcceptRequest = () => {
    const token = useSelector((state) => state.admin.adminData?.access_token || '');
    const students = useSelector((state) => state.admin.unAuthenticatedStudents || []);
    const teachers = useSelector((state) => state.admin.unAuthenticatedTeachers || []);
    const {  success, error } = useSelector((state) => state.admin);

    const [pendingUsers, setPendingUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmUser, setConfirmUser] = useState(null);
    const [isBulkAction, setIsBulkAction] = useState(false);
    const [processingAction, setProcessingAction] = useState(false);
    const itemsPerPage = 10;

    const dispatch = useDispatch();

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                dispatch(clearMessages());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error, dispatch]);

    useEffect(() => {
        const studentData = Array.isArray(students) ? students : [];
        const teacherData = Array.isArray(teachers) ? teachers : [];

        const formattedStudents = studentData.map(student => ({
            id: student.id || `s-${Math.random()}`,
            name: student.name || 'Unknown',
            email: student.email || '',
            type: 'student',
            originalData: student
        }));

        const formattedTeachers = teacherData.map(teacher => ({
            id: teacher.id || `t-${Math.random()}`,
            name: teacher.name || 'Unknown',
            email: teacher.email || '',
            type: 'teacher',
            originalData: teacher
        }));

        setPendingUsers([...formattedStudents, ...formattedTeachers]);
    }, [students, teachers]);

    const filteredUsers = pendingUsers.filter(user => {
        const matchesSearch = searchTerm === '' ||
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filterType === 'all' || user.type === filterType;
        return matchesSearch && matchesType;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handleApprove = async (userId) => {
        const userToApprove = pendingUsers.find(u => u.id === userId);
        if (!userToApprove) return;

        setProcessingAction(true);
        try {
            const success = await approveUser([userToApprove], token, dispatch);

            if (success) {
                setPendingUsers(prev => prev.filter(user => user.id !== userId));
                setSelectedUsers(prev => prev.filter(id => id !== userId));
                dispatch(setSuccess(`${userToApprove.name} has been approved successfully!`));
            }
        } catch (error) {
            console.error('Error approving user:', error);
            dispatch(setError('Failed to approve user. Please try again.'));
        } finally {
            setProcessingAction(false);
        }
    };

    const handleDecline = async (userId) => {
        const userToDecline = pendingUsers.find(u => u.id === userId);
        if (!userToDecline) return;

        setProcessingAction(true);
        try {
            const success = await declineUser([userToDecline], token, dispatch);

            if (success) {
                setPendingUsers(prev => prev.filter(user => user.id !== userId));
                setSelectedUsers(prev => prev.filter(id => id !== userId));
                dispatch(setSuccess(`${userToDecline.name} has been declined.`));
            }
        } catch (error) {
            console.error('Error declining user:', error);
            dispatch(setError('Failed to decline user. Please try again.'));
        } finally {
            setProcessingAction(false);
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedUsers.length === 0) return;

        setProcessingAction(true);
        if (action === 'approve') {
            const usersToApprove = pendingUsers.filter(user => selectedUsers.includes(user.id));
            const success = await approveUser(usersToApprove, token, dispatch);

            if (success) {
                setPendingUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
                setSelectedUsers([]);
                dispatch(setSuccess(`${selectedUsers.length} users approved successfully!`));
            }
        } else {
            const usersToDecline = pendingUsers.filter(user => selectedUsers.includes(user.id));
            const success = await declineUser(usersToDecline, token, dispatch);

            if (success) {
                setPendingUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
                setSelectedUsers([]);
                dispatch(setSuccess(`${selectedUsers.length} users declined successfully!`));
            }
        }
        setProcessingAction(false);
    };

    const openConfirmModal = (action, user, isBulk = false) => {
        setConfirmAction(action);
        setConfirmUser(user);
        setIsBulkAction(isBulk);
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setConfirmUser(null);
        setIsBulkAction(false);
    };

    const handleConfirm = async () => {
        if (!confirmAction) return;

        closeConfirmModal();

        if (isBulkAction) {
            await handleBulkAction(confirmAction);
        } else {
            if (confirmAction === 'approve') {
                await handleApprove(confirmUser.id);
            } else {
                await handleDecline(confirmUser.id);
            }
        }
    };

    const toggleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === currentItems.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(currentItems.map(user => user.id));
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const stats = {
        total: pendingUsers.length,
        teachers: pendingUsers.filter(u => u.type === 'teacher').length,
        students: pendingUsers.filter(u => u.type === 'student').length
    };
const ConfirmationModal = () => {
    if (!showConfirmModal) return null;

    const isApprove = confirmAction === 'approve';
    const title = isBulkAction 
        ? `${isApprove ? 'Approve' : 'Decline'} ${selectedUsers.length} Users`
        : `${isApprove ? 'Approve' : 'Decline'} ${confirmUser?.name}`;
    
    const message = isBulkAction
        ? `Are you sure you want to ${isApprove ? 'approve' : 'decline'} ${selectedUsers.length} selected ${selectedUsers.length === 1 ? 'user' : 'users'}?`
        : `Are you sure you want to ${isApprove ? 'approve' : 'decline'} ${confirmUser?.name}?`;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">

            <div className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity" aria-hidden="true"></div>

            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                                    isApprove ? 'bg-blue-100' : 'bg-red-100'
                                }`}>
                                    {isApprove ? (
                                        <CheckCircle className="h-6 w-6 text-blue-600" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    )}
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {title}
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {message}
                                        </p>
                                        {!isBulkAction && confirmUser && (
                                            <div className="mt-3 flex items-center p-3 bg-gray-50 rounded-lg">
                                                <div className={`h-8 w-8 rounded-full ${
                                                    confirmUser.type === 'teacher' ? 'bg-blue-100' : 'bg-purple-100'
                                                } flex items-center justify-center`}>
                                                    <span className={`${
                                                        confirmUser.type === 'teacher' ? 'text-blue-600' : 'text-purple-600'
                                                    } font-medium text-xs`}>
                                                        {getInitials(confirmUser.name)}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">{confirmUser.name}</p>
                                                    <p className="text-xs text-gray-500">{confirmUser.email}</p>
                                                </div>
                                                <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    confirmUser.type === 'teacher'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {confirmUser.type === 'teacher' ? 'Teacher' : 'Student'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm cursor-pointer ${
                                    isApprove
                                        ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                                        : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                            >
                                {isApprove ? 'Approve' : 'Decline'}
                            </button>
                            <button
                                type="button"
                                onClick={closeConfirmModal}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

    if (processingAction) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-7xl">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                                <div className="h-4 bg-gray-100 rounded w-96"></div>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-6">
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                        </div>
                    </div>
                </div>

                <div className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-7xl">
                    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-md animate-pulse">
                                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                            </div>
                            <div className="relative animate-pulse">
                                <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left">
                                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left">
                                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left">
                                            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right">
                                            <div className="h-4 bg-gray-200 rounded w-20 ml-auto animate-pulse"></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                                <div className="flex space-x-2">
                                    <div className="h-8 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 rounded-lg w-8 animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 rounded-lg w-8 animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 rounded-lg w-8 animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ConfirmationModal />

            {success && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-md">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <p className="ml-3 text-sm text-green-800 font-medium">{success}</p>
                            <button
                                onClick={() => dispatch(clearMessages())}
                                className="ml-auto pl-3 cursor-pointer"
                            >
                                <XCircle className="w-4 h-4 text-green-600 hover:text-green-800" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
                        <div className="flex items-center">
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="ml-3 text-sm text-red-800 font-medium">{error}</p>
                            <button
                                onClick={() => dispatch(clearMessages())}
                                className="ml-auto pl-3 cursor-pointer"
                            >
                                <XCircle className="w-4 h-4 text-red-600 hover:text-red-800" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-7xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Approval Queue</h1>
                            <p className="mt-1 text-sm sm:text-base text-gray-600">
                                Review and manage pending teacher and student registrations
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <div className="flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="ml-2 text-sm font-medium text-blue-700">
                                    {stats.total} pending {stats.total === 1 ? 'request' : 'requests'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500">Total Pending</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                                    <UserCheck className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500">Teachers</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.teachers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-100 p-2 rounded-lg">
                                    <GraduationCap className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500">Students</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.students}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                            >
                                <option value="all">All Types</option>
                                <option value="teacher">Teachers</option>
                                <option value="student">Students</option>
                            </select>
                        </div>
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                                {selectedUsers.length} selected
                            </span>
                            <button
                                onClick={() => openConfirmModal('approve', null, true)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve All
                            </button>
                            <button
                                onClick={() => openConfirmModal('decline', null, true)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Decline All
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === currentItems.length && currentItems.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => toggleSelectUser(user.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {user.avatar ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={user.avatar}
                                                                alt={user.name}
                                                            />
                                                        ) : (
                                                            <div className={`h-10 w-10 rounded-full ${user.type === 'teacher' ? 'bg-blue-100' : 'bg-purple-100'} flex items-center justify-center`}>
                                                                <span className={`${user.type === 'teacher' ? 'text-blue-600' : 'text-purple-600'} font-medium text-sm`}>
                                                                    {getInitials(user.name)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.type === 'teacher'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {user.type === 'teacher' ? (
                                                        <UserCheck className="w-3 h-3 mr-1" />
                                                    ) : (
                                                        <GraduationCap className="w-3 h-3 mr-1" />
                                                    )}
                                                    {user.type === 'teacher' ? 'Teacher' : 'Student'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => openConfirmModal('approve', user, false)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => openConfirmModal('decline', user, false)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5 mr-1" />
                                                        Decline
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && !processingAction && (
                        <div className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                All teacher and student registrations have been processed.
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterType('all');
                                    }}
                                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}

                    {filteredUsers.length > 0 && (
                        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <span className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastItem, filteredUsers.length)}
                                    </span> of{' '}
                                    <span className="font-medium">{filteredUsers.length}</span> results
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${currentPage === index + 1
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AcceptRequest;