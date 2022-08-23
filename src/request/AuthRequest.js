import { reject } from 'lodash';
import { resolve } from 'path';
import BaseModelRequest from './base/BaseModelRequest';

export default class AuthRequest extends BaseModelRequest {

  getModelName() {
    return 'users'
  }

  login(username, password) {
    // var params = {
    //   username: "t07", //username,
    //   password: "t07@2022" //password,
    // }
    // var res = this.postTo('https://utm07.duckdns.org/auth/login', params);
    // console.log("Login to Dashboard: " + res);
    var params = {
      username: username,
      password: password,
    }
    // return this.post('/login/', params);
    return new Promise(resolve => {
      const res = {
        "username": "admin",
        "password": "4725a1ae5331e9ebd6624b70912bcbd4c4102eedde1b0d372f7704feef5cdee4"
      }
      resolve(res)
    })
  }

  logout() {
    return this.get('/logout/');
  }

  register({ email, password, passwordConfirmation, username, dob, sex}) {
    let params = {
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      agree_term: 1,
      username:username,
      dob: dob,
      sex: sex
    }
    return this.post('/create-account', params);
  }

  resetPassword(params) {
    return this.post('/reset-password', params);
  }

  getCurrentUser(params) {
    return new Promise((resolve, reject) => {
    //   let url = '/users/current';
    //   var self = this;
    //   this.get(url, params)
    //       .then(function (res) {
    //         self.res = res;
    //         resolve(res);
    //       })
    //       .catch(function (error) {
    //         reject(error);
    //       });
        const res = { 
          "idUser": 1,
          "username": "admin",
          "roles": [
              {
                  "idUserrolerel": 1,
                  "idRole": 1,
                  "roleName": "superadmin",
                  "roleDescription": "Can do anything",
                  "idUser": 1,
                  "username": "admin"
              }
          ]
        }
        resolve(res)
    });
  }

  updateCurrentUser(params) {
    return new Promise((resolve, reject) => {
      let url = '/user/update-profile';
      var self = this;
      this.put(url, params)
          .then(function (user) {
            self.user = user;
            resolve(user);
          })
          .catch(function (error) {
            reject(error);
          });
    });
  }

  changePassword(params) {
    let url = '/user/change-password';
    return this.put(url, params);
  }

  getUserProfile() {
    return this.get('/users/current');
  }
}
