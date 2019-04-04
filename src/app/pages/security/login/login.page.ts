import {Component, OnInit, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {SecurityService} from '../security.service';
import {RSA_PUBLIC_KEY} from '../../../configs/security.config';
import {CommonService} from '../../../service/common.service';
import {RESPONSE_TYPE} from '../../../service/http-resource.config';
import {Store} from '@ngrx/store';
import {Init} from '../../../store/menuState/menu.actions';
import {MenuService} from '../../../service/menu.service';
import {UserService} from '../../../service/user.service';
import {catchError} from 'rxjs/internal/operators';
import {Observable} from 'rxjs/index';
import {AppService} from '../../../service/app.service';

declare var JSEncrypt: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  password = '';
  loginParams = {
    username: 'E1001',
    password: '123123',
    role: 'user',
    deviceId: '123123'
  };
  @ViewChild('form') formRef: any;
  constructor(
              private menuService: MenuService,
              private userService: UserService,
              private router: Router,
              private store: Store<{ count: number }>,
              private appService: AppService,
              private commonService: CommonService) {
    // storage.get('token').then(res => {
    //     return !!res && this.loginSuccess(0);
    //   });
  }
  ngOnInit() {
  }
  login() {
    const errorMessage = {
      username: {
        required: '请输入账号'
      },
      password: {
        required: '请输入密码'
      }
    };
    if (this.formRef.invalid) {
      this.commonService.errorTip(this.commonService.errorFormatTip(this.formRef, errorMessage));
      return;
    }
    this.userService.login( this.loginParams.username, this.loginParams.password).subscribe(
        res => {
            this.appService.initServices();
        },
        error => {
            this.commonService.errorTip(error.message);
        }
    );
  }
}
