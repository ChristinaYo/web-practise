import { request } from '../plugins/request'

export const login = (data) => {
    return request.post('/api/users/login', data)
}

export const register = (data) => {
    return request.post('/api/users', data)
}

export const getUser = () => {
    return request.get(`/api/user`)
}

export const updateUser = (data) => {
    return request.put(`/api/user`, data)
}

