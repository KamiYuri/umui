import { resolve } from 'path';
import BaseModelRequest from './base/BaseModelRequest';

export default class EngineRequest extends BaseModelRequest {

  getModelName() {
    return 'engines'
  }
  getList(params) {
    // return this.get('/engines/', params);
    return new Promise(resolve => {
      const res =  [
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

  find(params) {
    return this.put(`/engines/`, params);
  }

  update(engineId, params) {
    return this.put(`/engines/${engineId}`, params);
  }

  create(params) {
    return this.post('/engines/', params);
  }

  detail(engineId) {
    return this.get(`/engines/${engineId}`);
  }

  export(params) {
    return this.get('/engines/', params);
  }

  delete(engineId) {
    return this.del(`/engines/${engineId}`);
  }
}
