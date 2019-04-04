import {Injectable} from '@angular/core';
import {LoadingController, ToastController , AlertController } from '@ionic/angular';
import {Observable} from 'rxjs/index';
export const HTTP_RESOURCE_VIEW_CONFIG_CONSTANT = {
    LOADING_OPTIONS: {
        spinner: null,
        content: '请稍候...',
        cssClass: null,
        duration: null,
        backdropDismiss: true,
        showBackdrop: true,
        animated: true,
        translucent: true
    },
    TOAST_OPTIONS: {
        // message: '请求出现了错误',
        cssClass: null,
        duration: 3000,
        showCloseButton: null,
        closeButtonText: null,
        position:  'middle'
    }
};


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loadings: number;
  loadingStatus: boolean;
  load = null;
  isCreateLoading: boolean;
  createWatcher: Observable<any>;
  constructor(private toastController: ToastController,
              private loadingController: LoadingController) {
      this.loadingStatus = false;
      this.isCreateLoading = false;
      this.loadings = 0;
  }
  showLoading() {
      console.log('show')
      if (!this.loadingStatus && this.loadings === 0 && !this.isCreateLoading) {
          this.isCreateLoading = true;
          // 修正loading还未创建就调用了close
          Observable.create(ob => {
              ob.next('start');
              this.loadingController.create(
                  {
                      spinner: 'crescent',
                      message: '请稍候...',
                      translucent: true,
                  }
              ).then(res => {
                  this.isCreateLoading = false;
                  this.loadingStatus = true ;
                  this.loadings = 1;
                  this.load = res ;
                  res.present();
                  ob.next(res);
                  ob.complete();
              });
          }).subscribe(
              res =>　{
                  this.createWatcher = Observable.create( ob =>{
                     if (res !== 'start') {
                         ob.next(res);
                         ob.complete();
                     }
                  });
              }
          );
      } else {
          this.loadings++;
      }
  }
  closeLoading() {
      console.log('close')
      if (this.loadings <= 1) {
          if (this.load) {
              this.loadingStatus = false;
              this.loadings = 0;
              this.load.dismiss();
              this.load = null;
              return true;
          }
          if (this.isCreateLoading) {
              console.log(this.createWatcher);
              this.createWatcher.subscribe(res => {
                  this.loadingStatus = false;
                  this.loadings = 0;
                  res.dismiss();
                  this.load = null;
                  return true;
              });
          }
      } else {
          this.loadings--;
          return false;
      }
  }
  async errorTip(message, duration?) {
    const toast = await this.toastController.create(
        {
            message: message,
            duration: duration || 500,
            position: 'middle',
            color: 'danger'
        }
    );
    toast.present();
  }
  errorFormatTip(format, text) {
    let errorMess = '';
    if (format && format.invalid && format.controls) {
      const controls = this.reverseObj(format.controls);
      for (const c of Object.keys(controls)) {
        const control = format.controls[c];
        if (control && control['errors']) {
          for (const error of Object.keys(control['errors'])) {
            for (const t of Object.keys(text)) {
              switch (c) {
                case t:
                  errorMess = text[c][error];
                  break;
              }
            }
          }
        }
      }
      return errorMess;
    }
  }

  reverseObj(obj) {
    const arr = [];
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        arr.push([obj[i], i]);
      }
    }
    arr.reverse();
    const len = arr.length;
    const newObj = {};
    for (let i = 0; i < len; i++) {
      newObj[arr[i][1]] = arr[i][0];
    }
    return newObj;
  }

  dateFormat(fmt, date) {
    const o = {
      'M+': date.getMonth() + 1,               // 月份
      'd+': date.getDate(),                    // 日
      'h+': date.getHours(),                   // 小时
      'm+': date.getMinutes(),                 // 分
      's+': date.getSeconds(),                 // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds()             // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
      return fmt;
    }
  }
}
