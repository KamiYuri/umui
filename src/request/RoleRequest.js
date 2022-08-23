import { resolve } from 'path';
import BaseModelRequest from './base/BaseModelRequest';

export default class RoleRequest extends BaseModelRequest {

  getModelName() {
    return 'roles'
  }
  getList(params) {
    // return this.get('/roles/', params);
    return new Promise(resolve => {
      const res = [
        {
            "idRole": 3,
            "name": "monitor",
            "description": "System Monitor"
        },
        {
            "idRole": 1,
            "name": "superadmin",
            "description": "Can do anything"
        },
        {
            "idRole": 2,
            "name": "admin",
            "description": "Admin role"
        }
      ]
      resolve(res)
    })
  }

  update(roleId, params) {
    return this.put(`/roles/${roleId}`, params);
  }

  create(params) {
    return this.post('/roles/', params);
  }

  export(params) {
    return this.get('/roles/', params);
  }

  delete(roleId) {
    return this.del(`/roles/${roleId}`);
  }
}
