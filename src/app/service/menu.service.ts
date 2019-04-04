import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/internal/operators';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {RESTFUL_RESOURCE_ENDPOINT} from '../configs/resource.config';
import {Store} from '@ngrx/store';
import {Init} from '../store/menuState/menu.actions';
import {Storage} from '@ionic/storage';
import {LOCAL_STORAGE_KEY} from '../configs/storage.config';
import {StorageService} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    menuKey = 'menu';
    initStatus = false;
    menuList = [];
    updateTime = '';
    menuMapper = {};
    constructor(
        private http: HttpClient,
        private storage: Storage,
        private storageService: StorageService,
        private store: Store<{ menu: any }>) {
    }
    init() {
        return this.getStorageMenu().pipe(map(res => {
            this.dispatchMenu(res);
            console.log(this);
            return res;
        }));
    }
    dispatchMenu(res: {menuList: Array<any>, updateTime: string}) {
        this.store.dispatch(new Init(res));
        this.initStatus = true;
        this.menuList = res.menuList;
        this.menuMapper = this.transMenuToMapper(res.menuList);
        this.updateTime = res.updateTime;
    }
    transMenuToMapper(ml: Array<any> = []) {
        const rm = {};
        ml.forEach((res: {originPath: string , children: Array<string>}) => {
            if (res.children && res.children.length > 0) {
                rm[res.originPath] = this.transMenuToMapper( res.children);
            } else {
                rm[res.originPath] = res ;
            }
        });
        return rm;
    }
    initMenu(res) {
        this.dispatchMenu(res);
        this.storageService.set(LOCAL_STORAGE_KEY.MENU.USER_MENU, res, '用户菜单').subscribe();
    }
    // getMenu(): Observable<Array<any>> {
    //     // 首页直接进入该方法会导致两次dispatch动作
    //     return Observable.create(observer => {
    //         observer.next(this.getCachedMenu());
    //     }).pipe(catchError(e => this.getStorageMenu().pipe(map( (menu) => {
    //         this.transfromPath(menu, ['/app']);
    //         this.updateCachedMenu(menu);
    //         this.store.dispatch(new Init(menu));
    //         return menu.menuList;
    //     }))));
    // }
    transfromPath(menu, begin) {
        menu.originPath = menu.menuPath;
        menu.menuPath = [...begin, menu.menuPath];
        if ( menu.isvirtual === 0 || !menu.children || menu.children.length === 0 ) {
            return ;
        } else {
            menu.children.forEach( item => {
                this.transfromPath(item, menu.menuPath);
            });
        }
    }
    updateStorageMenu(para: {menuList: Array<any>, updateTime: string}) {
        this.storageService.set(LOCAL_STORAGE_KEY.MENU.USER_MENU, para, '用户菜单'  );
    }
    updateCachedMenu(para: {menuList: Array<any>, updateTime: string}) {
        this.menuList = para.menuList ;
        this.updateTime = para.updateTime ;
    }
    getCachedMenu(): Array<any> {
        if (!this.initStatus) {
            throw new Error('菜单未初始化，不能获取菜单信息');
        }
        return this.menuList;
    }
    getStorageMenu(): Observable<{menuList: Array<any>, updateTime: string}> {
        return  this.storageService.get(LOCAL_STORAGE_KEY.MENU.USER_MENU, '用户菜单');
    }
    getStoreMenu(): Observable<Array<any>> {
        return this.store.select('appRoot', 'menu' , 'menuList');
    }
    getUpdateTime() {
        return this.updateTime;
    }
    hasModule(code) {
        return this.menuList[0].children.some(r => r.menuName === code);
    }
    getMenu(path) {
        try {
           return Object.values(path.reduce((pr, cu) => {
                return pr[cu];
            }, this.menuMapper));
        } catch (e) {
            console.warn(path.toString() + '未找到对应功能');
            return [];
        }
    }
}
