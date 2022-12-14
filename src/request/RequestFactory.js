import MasterdataRequest from './MasterdataRequest';
import AuthRequest from './AuthRequest';
import UserRequest from './UserRequest';
import RoleRequest from './RoleRequest';
import UserRoleRelRequest from './UserRoleRelRequest';
import ContainmentRelRequest from './ContainmentRelRequest';
import EngineRequest from './EngineRequest';
import PermissionRequest from './PermissionRequest';
import RulePackageRequest from './RulePackageRequest';
import RulePackageObjectRelRequest from './RulePackageObjectRelRequest';
import IPSSettingRequest from './IPSSettingRequest';
import SystemHardeningRequest from './SystemHardeningRequest'

const requestMap = {
  MasterdataRequest,
  AuthRequest,
  UserRequest,
  RoleRequest,
  UserRoleRelRequest,
  ContainmentRelRequest,  
  EngineRequest,
  PermissionRequest,
  RulePackageRequest,
  RulePackageObjectRelRequest,
  IPSSettingRequest,
  SystemHardeningRequest
};

const instances = {};

export default class RequestFactory {

  static getRequest(classname) {
    let RequestClass = requestMap[classname];
    if (!RequestClass) {
      throw new Error('Invalid request class name: ' + classname);
    }

    let requestInstance = instances[classname];
    if (!requestInstance) {
        requestInstance = new RequestClass();
        instances[classname] = requestInstance;
    }

    return requestInstance;
  }

}
