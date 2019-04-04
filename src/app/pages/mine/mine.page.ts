import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../service/common.service';
import {NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import { Store, select } from '@ngrx/store';
import {SecurityService} from '../security/security.service';
import {Storage} from '@ionic/storage';
import { Observable } from 'rxjs';
import {RESPONSE_TYPE} from '../../service/http-resource.config';

import {VersionPage} from './version/version.page';

@Component({
  selector: 'app-mine',
  templateUrl: './mine.page.html',
  styleUrls: ['./mine.page.scss'],
})
export class MinePage implements OnInit {
    count$: Observable<number>;
  constructor(
      public navCtrl: NavController,
      private storage: Storage,
      private router: Router,
      private store: Store<{ count: number }>,
      private securityService: SecurityService,
      private commonService: CommonService) {}

  ngOnInit() {
  }
  goToView(name) {
      this.router.navigate(['/app', 'tabs', 'mine', name]);
  }

}
