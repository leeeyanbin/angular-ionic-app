import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(
      private userService: UserService,
  ) { }

  ngOnInit() {
  }

  logout() {
      this.userService.logout();
  }
}
