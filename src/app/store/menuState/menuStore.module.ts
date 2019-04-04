import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { menuReducer } from './menu.reducer';

@NgModule({
    imports: [StoreModule.forFeature('menu', menuReducer)],
})
export class MenuStoreModule {}
