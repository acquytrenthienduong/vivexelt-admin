import http from '../core/services/http'
import { buildQueryString } from '../util/url'
export default {
  signIn(payload) {
    const url = '/admin/user/login.json'
    return http.post(url, payload)
  },
}
