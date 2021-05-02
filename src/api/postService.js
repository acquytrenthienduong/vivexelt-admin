import http from '../core/services/http'

export default {
    getAllPost() {
        const url = '/post/getAllPost'
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

    updatePostById(payload, id){
        console.log(payload);
        console.log(id);
        const url = `/post/updatePost/` + id;
        return http.put(url, payload)
    }
}