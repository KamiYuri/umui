import BaseModelRequest from './base/BaseModelRequest';

export default class UserRequest extends BaseModelRequest {
  getModelName() {
    return 'ipsSettings';
  }
  getParams() {
    return this.get('/ipssettings/');
  }

  update(idSetting, value) {
    return this.put(`/ipssettings/${idSetting}`, { value });
  }
}
