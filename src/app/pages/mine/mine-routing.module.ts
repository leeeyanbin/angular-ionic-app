import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MinePage} from './mine.page';
import {SettingModule} from './setting/setting.module';
const routes: Routes = [
    {
        path: '',
        component: MinePage
    },
    {
        path: 'version',
        loadChildren: './version/version.module#VersionModule'
    },
    {
        path: 'setting',
        loadChildren: './setting/setting.module#SettingModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class MineRoutingModule {
}
