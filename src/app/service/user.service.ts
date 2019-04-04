import {Injectable} from '@angular/core';
import {RSA_PUBLIC_KEY} from '../configs/security.config';
import {RESTFUL_RESOURCES} from '../configs/resource.config';
import {HttpResourceService} from './http-resource.service';
import {RESPONSE_TYPE} from '../configs/http-resource.config';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs';
import {LOCAL_STORAGE_KEY} from '../configs/storage.config';
import {merge} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';
import {MenuService} from './menu.service';
import {Router} from '@angular/router';
import {CommonService} from './common.service';
import {StorageService} from './storage.service';

declare var JSEncrypt: any;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    deviceInformation: any = {};

    userTokenInfo: any;

    userInfo: any;

    userCardInfo: any;

    currentUserCardID: any;

    lastUserName: string;

    constructor(
        // private mobileAccessibility: MobileAccessibility,
        private menuService: MenuService,
        private router: Router,
        // public nativeService: NativeService,
        private commonService: CommonService,
        private storageService: StorageService,
        public httpResourceService: HttpResourceService,
        public storage: Storage) {
    }
    init (): Observable<any> {
        // 获取用户信息
        // 获取用户token信息
        // 更新http头部0
        const token = this.getStorageUserTokenInfo().pipe(
            map( res => {
                return {
                    key: 'userTokenInfo',
                    value: res
                };
            })
        );
       const userinfo =  this.getStorageUserInfo().pipe(
            map( res => {
                return {
                    key: 'userInfo',
                    value: res,
                };
            })
        );
       return merge(token, userinfo).pipe(map(res => {
           this[res.key] = res.value;
           if (res.key === 'userTokenInfo') {
               this.setHttpAuthority(res.value);
           }
           return res;
       }));
    }
    login(username: string, password: string, role?: string): Observable<Response> {
        this.setLastUserName(username);
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(RSA_PUBLIC_KEY);
        const encryptPassword = encrypt.encrypt(password);
        const parameters = {
            username: username,
            password: encryptPassword,
            role: 'user',
            deviceId: '123123' // this.nativeService.device.uuid
        };
        return this.httpResourceService.post(RESTFUL_RESOURCES.SECURITY.LOGIN, parameters, {
            headers: {
                'Version-Info': 'client_type=app; web_version=2.0.3; app_version=0.0.1',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': this.httpResourceService.getBaseUrl()
            }
        }, true, true).pipe(
            map((data: any) => {
                console.log('logindata', data)
                if (RESPONSE_TYPE.SUCCESS === data['code']) {
                    /*if(data['needChgPwd']==true){
                        return data;
                    }*/
                    this.setUserInfo(Object.assign({}, this.userInfo, {userCode: username, userMobile: data['phone']}));
                    const tokenInfo = {
                        cookie: data['cookie'],
                        accessInfo: {accessToken: data['accessToken'], association: data['association']}
                    };
                    const menus = data.authRouters ? data.authRouters[0] : {};
                    // menu 信息进storage ,store,cache
                    this.menuService.transfromPath(menus, []);
                    this.menuService.initMenu({menuList: [menus] || [], updateTime: Date.now().toString()});
                    this.setUserTokenInfo(tokenInfo);
                    return data;
                    // this.events.publish(SYSTEM_EVENTS.SECURITY.LOGIN, tokenInfo);
                    // 正常登陆也要缓存用户角色与原始用户相关信息,用另个账号登录后还是显示上个用户的信息
                    // if (role == null) {
                    //     this.setUserRole('-1')
                    //     this.setOriginalUserTokenInfo(this.userTokenInfo)
                    //     this.setOriginalUserInfo(this.userInfo)
                    //     this.setLastTokenInfo(this.userTokenInfo)
                    // }
                } else {
                    throw new Error(data.information);
                }
            })
        );
    }
    logout(): void {
        if (this.userTokenInfo && this.userInfo) {
            this.httpResourceService.post(RESTFUL_RESOURCES.SECURITY.LOGOUT, null, false, false)
                .subscribe(res => {
                    this.clearUser();
                    this.router.navigate(['/login']);
                }, error => {
                    console.log('error');
                });
        }
        // this.events.publish(SYSTEM_EVENTS.SECURITY.LOGOUT, null);
    }

    clearUser() {
        this.storageService.remove(LOCAL_STORAGE_KEY.USER.USER_INFO);
        this.storageService.remove(LOCAL_STORAGE_KEY.USER.USER_TOKEN_INFO);
        this.storageService.remove(LOCAL_STORAGE_KEY.USER.USER_ROLE);
        this.storageService.remove(LOCAL_STORAGE_KEY.USER.CURRENT_USER_CARD_INFO);
        this.storageService.remove(LOCAL_STORAGE_KEY.MENU.USER_MENU);
        this.userInfo = null;
        this.userTokenInfo = null;
        this.currentUserCardID = null;
        // this.httpResourceService.requestOptionsArgs.headers['Authority']= null;
        delete this.httpResourceService.requestOptionsArgs.headers.Authority;
    }

    setZoom(zoom): Promise<any> {
        return this.storage.set(LOCAL_STORAGE_KEY.GENERAL.ZOOM, zoom).then(() => {
            console.log('zoom' + zoom);
            const body = document.body;
            body.style.zoom = zoom > 1.2 ? 1.2 : zoom;
            // this.mobileAccessibility.setTextZoom(zoom * 100);
        });
    }

    getZoom(): Promise<any> {
        return this.storage.get(LOCAL_STORAGE_KEY.GENERAL.ZOOM).then((data) => {
            if (data) {
                return data;
            } else {
                return 1;
            }
        });
    }
    initZoom(): Promise<any> {
        return this.storage.get(LOCAL_STORAGE_KEY.GENERAL.ZOOM).then((data) => {
            if (data) {
                return this.setZoom(data);
            } else {
                return this.setZoom(1);
            }
        });
    }

    /*queryUserInfo(loadingOptions = true, toastOpions = true): Observable<any> {
        return this.httpResourceService.get(RESTFUL_RESOURCES.SECURITY.USER_INFO, {}, loadingOptions, toastOpions)
            .map((data: any) => {
                if (RESPONSE_TYPE.SUCCESS == data.code) {
                    let userInfo = data.information;
                    try {
                        userInfo['extraInfo'] = JSON.parse(data['extraInfo']);
                    } catch (e) {
                        return Observable.throw({code: RESPONSE_TYPE.LOCAL_ERROR, message: '获取用户信息失败'});
                    }
                    userInfo['homeMenu'] = data['homeMenu'];
                    userInfo['fabMenu'] = data['fabMenu'];

                    this.setUserInfo(userInfo);
                    this.events.publish(SYSTEM_EVENTS.USER_DATA.QUERY_USER_INFO, userInfo);
                }
                return data;
            });
    }*/

    setUserInfo(userInfo) {
        this.storageService.set(LOCAL_STORAGE_KEY.USER.USER_INFO, userInfo, '用户认证信息').subscribe(res => this.userInfo = userInfo);
    }
    getCachedUserInfo() {
      return this.userInfo;
    }
    getUserInfo() {
        return this.getCachedUserInfo();
    }
    getStorageUserInfo(): Observable<any> {
            return this.storageService.get(LOCAL_STORAGE_KEY.USER.USER_INFO, '用户信息').pipe(map((res) => this.userInfo = res));
    }
    getStorageUserTokenInfo(): Observable<any> {
        return this.storageService.get(LOCAL_STORAGE_KEY.USER.USER_TOKEN_INFO, '用户认证信息').pipe(map(res => this.userTokenInfo = res));
    }
    getUserTokenInfo() {
        return this.userTokenInfo ;
    }
    setUserTokenInfo(userTokenInfo: any) {
        this.storageService.set(LOCAL_STORAGE_KEY.USER.USER_TOKEN_INFO, userTokenInfo , '用户认证信息').subscribe(
            res => {
                this.userTokenInfo = userTokenInfo;
                this.setHttpAuthority(userTokenInfo);
            }
        );
    }

    setHttpAuthority(userToken: any = this.userTokenInfo) {
        if (userToken) {
            if (userToken.cookie) {
                this.httpResourceService.requestOptionsArgs.headers = this.httpResourceService.requestOptionsArgs.headers || {};
                this.httpResourceService.requestOptionsArgs.headers['Authority'] =
                    `token=${userToken.cookie.token};` +
                    `u_logints=${userToken.cookie.u_logints};` +
                    `u_usercode=${userToken.cookie.u_usercode};` +
                    `u_role=${userToken.cookie.u_role};`;
            }
            if (userToken.cookie && userToken.accessInfo) {
                //  this.httpResourceService.requestOptionsArgs.params =
                // this.httpResourceService.requestOptionsArgs.params || new HttpParams();
                this.httpResourceService.requestOptionsArgs.params = {
                    'userid': userToken.cookie.u_usercode, 'token': userToken.accessInfo.accessToken, 'role': userToken.cookie.u_role
                };
            }
        }
    }
}
