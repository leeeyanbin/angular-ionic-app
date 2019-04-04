import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {Observable} from 'rxjs/index';
import {select, Store} from '@ngrx/store';
import {map, catchError} from 'rxjs/internal/operators';
import {selectMenus} from '../../store/menuState/menu.reducer';
import {MenuService} from '../../service/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    menu$: Observable<any>;
    constructor(public navCtrl: NavController,
                public router: Router,
                private menuService: MenuService,
                private store: Store<{ menu: any }>,
                private route: ActivatedRoute) {
            this.menu$ = this.store.select(selectMenus);
    }
    ngOnInit() {
    }
    openPage($event, name) {
        this.router.navigate(name);
    }
}
