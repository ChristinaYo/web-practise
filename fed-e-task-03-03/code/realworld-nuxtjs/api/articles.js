import { request } from '../plugins/request'

export const getArticles = (params={}) => {
    return request.get('/api/articles', { params })
}

export const getYourFeedArticles = (params) => {
    return request.get('/api/articles/feed', { params })
}

export const getTags = () => {
    return request.get('/api/tags')
}

export const addFavorite = (slug) => {
    return request.post(`/api/articles/${slug}/favorite`)
}

export const deleteFavorite = (slug) => {
    return request.delete(`/api/articles/${slug}/favorite`)
}

export const getArticle = (slug) => {
    return request.get(`/api/articles/${slug}`)
}

export const createArticle = (data) => {
    return request.post('/api/articles', data)
}

export const updateArticle = (slug, data) => {
    return request.put(`/api/articles/${slug}`, data)
}

export const deleteArticle = (slug) => {
    return request.delete(`/api/articles/${slug}`)
}

export const getComments = (slug) => {
    return request.get(`/api/articles/${slug}/comments`)
}

export const addComment = (slug, data) => {
    return request.post(`/api/articles/${slug}/comments`, data)
}

export const deleteComment = (slug, id) => {
    return request.delete(`/api/articles/${slug}/comments/${id}`)
}

