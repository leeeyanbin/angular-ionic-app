import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-version',
  templateUrl: './version.page.html',
  styleUrls: ['./version.page.scss'],
})
export class VersionPage implements OnInit {

  constructor(
      public navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

}
