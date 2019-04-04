import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MinePage } from './mine.page';
import {MineRoutingModule} from './mine-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MineRoutingModule
  ],
  declarations: [MinePage]
})
export class MineModule {}
