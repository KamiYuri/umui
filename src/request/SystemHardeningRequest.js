import BaseModelRequest from './base/BaseModelRequest';

export default class UserRequest extends BaseModelRequest {

  getModelName() {
    return 'systemHardening'
  }
  getHostList(params) {
    return this.get('/hosts/', params);
  }

  update(hostId, params) {
    return this.put(`/hosts/${hostId}`, params);
  }

  create(params) {
    return this.post('/hosts/', params);
  }

  delete(hostId) {
    return this.del(`/hosts/${hostId}`);
  }

  getChecklist() {
    return this.get('/checklist/');
  }

  downloadChecklist(params) {
    return this.post('/checklist/', params,
    {
      responseType: "arraybuffer",
    });
  }
}
