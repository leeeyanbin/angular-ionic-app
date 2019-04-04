import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Store} from '@ngrx/store';
import {UserService} from './service/user.service';
import {MenuService} from './service/menu.service';
import {Router} from '@angular/router';
import {merge} from 'rxjs/index';
import {StorageService} from './service/storage.service';
import {CommonService} from './service/common.service';
import {InitAppSuccess} from './store/app.actions';
import {AppService} from './service/app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private userService: UserService,
    private menuService: MenuService,
    private router: Router,
    private statusBar: StatusBar,
    private appService: AppService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.appService.initServices();
    });
  }
}
