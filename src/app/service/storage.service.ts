import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(
        public storage: Storage) {
    }
    init () {
    }
    get(key, name= '未定义'): Observable<any> {
        console.log('获取缓存：' + name);
        return Observable.create(
            observe => {
                this.storage.get(key).then(res => {
                    if (res !== void 0 && res !== null) {
                        console.log(name + ' 获取成功：' + res.toString());
                        observe.next(res);
                    } else {
                        console.log(name + ' 获取失败');
                        observe.error(name + ' 缓存不存在');
                    }
                    observe.complete();
                }, error => {
                    console.log(name + ' 获取失败');
                    observe.error(error) ;
                    observe.complete();
                });
            }
        );
    }
    set(key, value, name = '未定义'): Observable<any> {
        console.log('正在缓存：' + key);
        return Observable.create(
            observe => {
                this.storage.set(key, value).then(res => {
                    console.log(name + ' 缓存成功');
                    observe.next(res);
                    observe.complete();
                }, error => {
                    console.log(name + ' 缓存失败');
                    observe.error(error) ;
                    observe.complete();
                });
            }
        );
    }
    remove(key) {
        this.storage.remove(key);
    }
}
