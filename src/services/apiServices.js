import axios from 'axios';
import { appendCourse, appendNewStudent, appendNewTeacher, setAllCourses, setAllStudents, setAllTeachers, setAllUnAuthenticatedStudents, setAllUnAuthenticatedTeachers, setAdminData, setError, setLoading, setSuccess } from '../Redux/admin';
import { setStudentData } from '../Redux/student';
import { setTeacherData } from '../Redux/teacher';

// const API_BASE_URL = 'https://smart-campus-backenduoss.vercel.app/'
const API_BASE_URL = 'https://smart-campus-backend-orqg.onrender.com/'

export const login = async (userData, dispatch, navigation) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.post(`${API_BASE_URL}login/`, null, {
            params: {
                email: userData.email,
                password: userData.password,
                role: userData.role
            },
            headers: { 'accept': 'application/json' },
        });
        if (response.data) {
            const dataToStore = Array.isArray(response.data) ? response.data[0] : response.data;
            if (userData.role === 'teacher') {
                dispatch(setTeacherData(dataToStore))
                navigation('/Teacher-Dashboard')
            } else if (userData.role === 'student') {
                dispatch(setStudentData(dataToStore));
                navigation('/Student-Dashboard')
            }
            else {
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


export const register = async (userData, dispatch) => {

    try {

        dispatch(setLoading(true));
        const response = await axios.post(`${API_BASE_URL}user/`, {
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

export const verifyOTP = async (userData, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.post(`${API_BASE_URL}user/verify_otp`, {
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
        const response = await axios.post(`${API_BASE_URL}user/resend_otp`, {
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

        const response = await axios.get(`${API_BASE_URL}user/all_students`, {
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
        const response = await axios.get(`${API_BASE_URL}user/all_teachers/`, {
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
        const response = await axios.get(`${API_BASE_URL}user/all_unauthenticated_teachers`, {
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
        const response = await axios.get(`${API_BASE_URL}user/all_unauthenticated_students`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        dispatch(setAllUnAuthenticatedStudents(response.data))
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg))
    } finally {
        dispatch(setLoading(false))
    }
}

export const approveUser = async (userData, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.put(`${API_BASE_URL}user/approve_unauthenticated_user`, {
            id: userData.id
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
        })

        if (response.data.role === 'teacher') {
            dispatch(appendNewTeacher(response.data))
            return
        } else if (response.data.role === 'student') {
            dispatch(appendNewStudent(response.data))
            return
        }
        dispatch(setError('Something Went Wrong'))
    } catch (e) {
        const msg = e.response?.data?.message || 'Something Went Wrong';
        dispatch(setError(msg))
    } finally {
        dispatch(setLoading(false))
    }
}


export const getAllCourses = async (token, dispatch) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${API_BASE_URL}course`, {
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
        const response = await axios.post(`${API_BASE_URL}course`, {
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

