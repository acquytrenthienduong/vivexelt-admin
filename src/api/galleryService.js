import http from '../core/services/http'


export default {
    getAllGallery() {
        const url = '/image/getAllImage'
        return http.get(url);
    },

    createGallery(payload) {
        const url = '/image/upload-one'
        http.post(url, payload);
    },

    getGalleryById(id) {
        const url = '/image/getOne/' + id;
        return http.get(url);
    },

    updateGalleryById(payload, id) {
        const url = `/image/updateImage/` + id;
        return http.put(url, payload)
    },

    deleteGalleryById(id, isMultiple) {
        const url = `/image/deleteImage/` + id;
        return http.post(url)
    },

    getImageById(id) {
        const url = '/image/sendImage/' + id;
        return http.get(url);
    },
}