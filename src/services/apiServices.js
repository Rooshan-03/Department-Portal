import axios from 'axios';
import { appendCourse, appendNewStudent, appendNewTeacher, setAllCourses, setAllStudents, setAllTeachers, setAllUnAuthenticatedStudents, setAllUnAuthenticatedTeachers, setAdminData, setError, setLoading, setSuccess, setStudentsCount, setTeachersCount, removeFromUnauthenticatedTeachers, removeFromUnauthenticatedStudents, setActiveCoursesCount, setPendingComplaints, setRecentUsers } from '../Redux/admin';
import { setStudentData } from '../Redux/student';
import { setTeacherData } from '../Redux/teacher';
import { data } from 'react-router-dom';
import { storeData } from './Validation';

// const API_BASE_URL = 'https://smart-campus-backenduoss.vercel.app/'
// const API_BASE_URL = 'https://smart-campus-backend-orqg.onrender.com/'
const API_BASE_URL = 'http://153.92.208.33/smart-campus/'


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
            // For students/teachers, data is in response.data.user
            // For admins, data is in response.data.admin
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

export const getAllStudents = async (token, dispatch) => {
    try {
        dispatch(setLoading(true))

        const response = await axios.get(`${API_BASE_URL}user/all-students/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        dispatch(setAllStudents(response.data))
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg))
    } finally {
        dispatch(setLoading(false))
    }
}


export const getAllTeachers = async (token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${API_BASE_URL}user/all-teachers/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        dispatch(setAllTeachers(response.data))
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg))
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
        dispatch(appendCourse(response.data))
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg))
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




