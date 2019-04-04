import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {CommonService} from './common.service';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {UserService} from './user.service';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {MenuService} from './menu.service';
import {Store} from '@ngrx/store';
import {InitAppSuccess} from '../store/app.actions';
import {merge} from 'rxjs/index';
@Injectable({
    providedIn: 'root'
})
export class AppService {
    loadings: number;
    loadingStatus: boolean;
    load = null;
    constructor(
        private splashScreen: SplashScreen,
        private userService: UserService,
        private menuService: MenuService,
        private router: Router,
        private store: Store<{ menu: any }>,
    ) {}
    // 初始化其它必要服务
    initServices() {
        merge(
            this.menuService.init(),
            this.userService.init()
        ).subscribe(
            res => {
            },
            error => {
                this.splashScreen.hide();
                this.router.navigate(['/login']);
            },
            () => {
                setTimeout(() => {
                    this.store.dispatch(new InitAppSuccess());
                }, 1000);
                this.splashScreen.hide();
                this.router.navigate(['/app/sap/xt/dd']);
            }
        );
    }
}
