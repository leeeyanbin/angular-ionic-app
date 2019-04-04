import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AppGuard} from './app.guard';
import {TabsPage} from './pages/tabs/tabs.page';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: './pages/security/login/login.module#LoginPageModule'
    },
    {
        path: 'app',
        children: [
            {
                path: 'tabs',
                component: TabsPage,
                children: [
                    {
                        path: 'home',
                        loadChildren: './pages/home/home.module#HomePageModule'
                    },
                    {
                        path: 'found',
                        loadChildren: './pages/found/found.module#FoundPageModule'
                    },
                    {
                        path: 'mine',
                        loadChildren: './pages/mine/mine.module#MineModule'
                    },
                    {
                        path: '',
                        redirectTo: '/app/tabs/home',
                        pathMatch: 'full'
                    }
                ]
            },
        ],
        canActivate: [AppGuard]
    },
    {
        path: '',
        redirectTo: '/app/tabs/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
