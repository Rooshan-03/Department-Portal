import axios from 'axios';
import { appendCourse, appendNewStudent, appendNewTeacher, setAllCourses, setAllStudents, setAllTeachers, setAllUnAuthenticatedStudents, setAllUnAuthenticatedTeachers, setAdminData, setError, setLoading, setSuccess, setStudentsCount, setTeachersCount, removeFromUnauthenticatedTeachers, removeFromUnauthenticatedStudents, updateUserLocal, deleteUserLocal, setAllComplaints } from '../Redux/admin';
import { setStudentData } from '../Redux/student';
import { setTeacherData } from '../Redux/teacher';
import { storeData } from './Validation';

// const API_BASE_URL = 'https://smart-campus-backenduoss.vercel.app/'
// const API_BASE_URL = 'https://smart-campus-backend-orqg.onrender.com/'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//Login

export const login = async (userData, dispatch, navigation) => {
    try {
        dispatch(setLoading(true));
        const formData = new URLSearchParams();
        formData.append('username', userData.email);
        formData.append('password', userData.password);

        const response = await axios.post(`${API_BASE_URL}auth/login/`, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        );
        if (response.data) {
            let dataToStore;
            if (userData.role === 'student') {
                dataToStore = {
                    ...response.data.user,
                    access_token: response.data.access_token
                };
                dispatch(setStudentData(dataToStore))
                navigation('/Student-Dashboard')
            } else if (userData.role === 'teacher') {
                dataToStore = {
                    ...response.data.user,
                    access_token: response.data.access_token
                };
                dispatch(setTeacherData(dataToStore))

                navigation('/Teacher-Dashboard')
            } else {
                dataToStore = {
                    ...response.data.admin,
                    access_token: response.data.access_token
                };
                dispatch(setAdminData(dataToStore));
                getAllCourses(response.data.access_token, dispatch);
                loadDashboard(response.data.access_token, dispatch);
                navigation('/Admin-Dashboard')
                console.log(dataToStore)
            }
        } else {
            dispatch(setError("No data received from server"));
        }
    } catch (err) {
        console.log(err)
        const errorMessage = err.response?.data?.detail || "Login failed";
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
}

// Registration


export const register = async (userData, dispatch) => {

    try {

        dispatch(setLoading(true));
        const response = await axios.post(`${API_BASE_URL}auth/create/`, {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        dispatch(setSuccess(response.data.detail))

    } catch (error) {
        const errorMessage = error.response?.data?.detail || "Something went wrong";
        dispatch(setError(errorMessage));

    } finally {
        dispatch(setLoading(false));
    }
};


export const loadDashboard = async (token, dispatch) => {
    try {
        dispatch(setLoading(true))

        const response = await axios.get(`${API_BASE_URL}user/load-admin-dashboard/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = response.data
        storeData(data, dispatch)
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg))
    } finally {
        dispatch(setLoading(false))
    }
}


// OTP 


export const verifyOTP = async (userData, dispatch) => {
    try {
        dispatch(setLoading(true))
        await axios.post(`${API_BASE_URL}auth/verify-otp/`, {
            email: userData.email,
            otp: userData.otp
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        dispatch(setSuccess('Otp Verified , Contact Admin to login'))
    } catch (error) {
        dispatch(setError(error.message))
    } finally {
        dispatch(setLoading(false))
    }
}

export const resendOTP = async (userData, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.post(`${API_BASE_URL}auth/resend-otp`, {
            email: userData.email,
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        dispatch(setSuccess('Otp sent , Verify to continue'))

        dispatch(setError(response.data))
    } catch (error) {
        dispatch(setError(error.message))
    } finally {
        dispatch(setLoading(false))
    }
}







export const getAllUnauthenticatedTeachers = async (token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${API_BASE_URL}user/all-unauthenticated-teachers/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        dispatch(setAllUnAuthenticatedTeachers(response.data))
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg))
    } finally {
        dispatch(setLoading(false))
    }
}


export const getAllUnauthenticatedStudents = async (token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${API_BASE_URL}user/all-unauthenticated-students/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        dispatch(setAllUnAuthenticatedStudents(response.data))
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg));
    } finally {
        dispatch(setLoading(false))
    }
}

export const approveUser = async (users, token, dispatch) => {
    const userIds = users.map(user => user.id);

    try {
        dispatch(setLoading(true));

        await axios.put(
            `${API_BASE_URL}user/approve-unauthenticated-user/`,
            { id: userIds },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        users.forEach(user => {
            const dataToAppend = user.originalData || user;

            if (user.type === 'teacher' || dataToAppend.role === 'teacher') {
                dispatch(appendNewTeacher(dataToAppend));
            } else {
                dispatch(appendNewStudent(dataToAppend));
            }
        });

        return true;
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg));
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

export const declineUser = async (users, token, dispatch) => {
    const userIds = users.map(user => user.id);

    try {
        dispatch(setLoading(true));

        await axios.put(
            `${API_BASE_URL}user/decline-unauthenticated-user/`,
            { id: userIds },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        users.forEach(user => {
            const role = user.role || user.originalData?.role;

            if (role === 'teacher') {
                dispatch(removeFromUnauthenticatedTeachers(user.id));
            } else {
                dispatch(removeFromUnauthenticatedStudents(user.id));
            }
        });

        return true;
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg));
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

export const getAllCourses = async (token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${API_BASE_URL}course/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        dispatch(setAllCourses(response.data))
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg))
    } finally {
        dispatch(setLoading(false))
    }
}

export const addNewCourse = async (userData, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.post(`${API_BASE_URL}course/`, {
            name: userData.name,
            teacher_id: userData.teacherId,
            course_code: userData.courseCode
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
        })
        dispatch(setSuccess('Course Added Successfully'))
        dispatch(appendCourse(response.data))
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg))
    } finally {
        dispatch(setLoading(false))
    }
}

export const enrollStudent = async (userData, dispatch) => {
    try {
        dispatch(setLoading(true))
        await axios.post(`${API_BASE_URL}course/enroll/`, {
            student_id: userData.student_id,
            course_id: userData.course_id
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
        })
        dispatch(setSuccess('Student Enrolled Successfully'))
    } catch (error) {
        dispatch(setError(error.message))
    } finally {
        dispatch(setLoading(false))
    }
}




export const deleteUser = async (userData, dispatch) => {
    try {
        dispatch(setLoading(true))
        await axios.delete(`${API_BASE_URL}user/${userData.id}/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
        })
        dispatch(deleteUserLocal(userData.id));
        dispatch(setSuccess('User Deleted Successfully'))
    } catch (error) {
        dispatch(setError(error.message))
    } finally {
        dispatch(setLoading(false))
    }
}

export const updateUser = async (userData, dispatch) => {
    try {
        dispatch(setLoading(true))
        await axios.put(`${API_BASE_URL}user/${userData.id}/`, {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            is_active: userData.is_active,
            is_authenticated: userData.is_authenticated,
            is_verified_email: userData.is_verified_email
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
        })
        dispatch(updateUserLocal(userData));
        dispatch(setSuccess('User Updated Successfully'))
    } catch (error) {
        dispatch(setError(error.message))
    } finally {
        dispatch(setLoading(false))
    }
}




export const updateComplaintStatus = async (userData, dispatch) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}complaint/${userData.complaintId}/status`, null, {
            params: { status: userData.newStatus },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            },
        }
        );
        dispatch(setSuccess('Complaint Status Updated'))
        console.log('Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating status:', error.response?.data || error.message);
        throw error;
    }
};


export const getAllComplaints = async (token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${API_BASE_URL}complaint/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        dispatch(setAllComplaints(response.data))
    } catch (e) {
        const msg = e.response?.data?.message || 'Failed to get Complaints';
        dispatch(setError(msg))
        dispatch(setAllComplaints([]))
    } finally {
        dispatch(setLoading(false))
    }
}



// ==================== STUDENT API SERVICES ====================

export const getAllCoursesForStudent = async (token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${API_BASE_URL}course/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    } catch (e) {
        const msg = e.response?.data?.message || 'Failed to load courses';
        dispatch(setError(msg))
        return []
    } finally {
        dispatch(setLoading(false))
    }
}

export const getEnrolledCourses = async (studentId, token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${API_BASE_URL}course/get-student-courses/${studentId}/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    } catch (e) {
        const msg = e.response?.data?.message || 'Failed to load enrolled courses';
        dispatch(setError(msg))
        return []
    } finally {
        dispatch(setLoading(false))
    }
}

export const enrollInCourse = async (courseId, studentId, token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.post(`${API_BASE_URL}course/enroll/`, {
            course_id: courseId,
            student_id: studentId
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return { success: true, data: response.data }
    } catch (e) {
        const msg = e.response?.data?.detail || e.response?.data?.message || 'Failed to enroll in course';
        dispatch(setError(msg))
        return { success: false, error: msg }
    } finally {
        dispatch(setLoading(false))
    }
}

export const updateStudentSettings = async (userData, token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const updateData = {
            name: userData.name,
            email: userData.email
        };

        // Add password if provided
        if (userData.newPassword) {
            updateData.password = userData.newPassword;
        }

        const response = await axios.put(`${API_BASE_URL}user/${userData.id}/`, updateData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return { success: true, data: response.data }
    } catch (e) {
        const msg = e.response?.data?.detail || 'Failed to update settings';
        dispatch(setError(msg))
        return { success: false, error: msg }
    } finally {
        dispatch(setLoading(false))
    }
}




