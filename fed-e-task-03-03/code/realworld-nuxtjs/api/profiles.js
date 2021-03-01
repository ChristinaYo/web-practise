import { request } from '../plugins/request'

export const addFollow = (username) => {
    return request.post(`/api/profiles/${username}/follow`)
}

export const deleteFollow = (username) => {
    return request.delete(`/api/profiles/${username}/follow`)
}

export const getProfile = (username) => {
    return request.get(`/api/profiles/${username}`)
}