import { resolve } from 'path';
import BaseModelRequest from './base/BaseModelRequest';

export default class UserRequest extends BaseModelRequest {

  getModelName() {
    return 'users'
  }
  getList(params) {
    // return this.get('/users/', params);
    return new Promise(resolve => {
      const res = [
        {
            "idEngine": 1,
            "specs": "{\"hostname\":\"192.168.122.20\",\"port\":\"8000\"}",
            "idObject": 2,
            "name": "192.168.122.20"
        },
        {
            "idEngine": 2,
            "specs": "{\"hostname\":\"192.168.122.21\",\"port\":\"8000\"}",
            "idObject": 3,
            "name": "192.168.122.21"
        },
        {
            "idEngine": 3,
            "specs": "{\"hostname\":\"netips.duckdns.org\",\"port\":\"8000\"}",
            "idObject": 4,
            "name": "netips.duckdns.org"
        }
      ]
      resolve(res)
    })
  }

  update(userId, params) {
    return this.put(`/users/${userId}`, params);
  }

  create(params) {
    return this.post('/users/', params);
  }

  export(params) {
    return this.get('/users/', params);
  }

  delete(userId) {
    return this.del(`/users/${userId}`);
  }
}
