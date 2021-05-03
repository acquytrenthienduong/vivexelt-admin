import { is } from 'date-fns/locale';
import { forEach } from 'lodash';
import http from '../core/services/http'

export default {
    getAllPost(page, limit) {
        const url = `/post/getAllPost/${page}/${limit}`
        return http.get(url);
    },

    createPost(payload) {
        const url = '/post/createPost'
        http.post(url, payload);
    },

    getPostById(id) {
        const url = '/post/getOnePost/' + id;
        return http.get(url);
    },

    updatePostById(payload, id) {
        const url = `/post/updatePost/` + id;
        return http.put(url, payload)
    },

    deletePostById(id, isMultiple) {
        const url = `/post/deletePost/` + id;
        return http.post(url)
    }
}