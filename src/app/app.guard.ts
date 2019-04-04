import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs/index';
import {Store} from '@ngrx/store';
import {CommonService} from './service/common.service';
@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  constructor(private storage: Storage,
              private store: Store<any>,
              private commonService: CommonService,
              private router: Router) { }
  // 进入根页面意味着app初始化已经完成
  canActivate() {
    // this.commonService.showLoading();  // 可配置成其它等待页面
    return Observable.create(ob => {
        this.store.select('appRoot', 'appInitStatus').subscribe(
            res => {
              if (res) {
                  // this.commonService.closeLoading();
                  ob.next(true);
              }
            }
        );
      }
    );
  }
  canActivateChild() {
      return Observable.create(ob => {
          ob.next(true);
      });
  }
}
