import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { appReducer } from './app.reducer';
import {MenuStoreModule} from './menuState/menuStore.module';
import { NgModule } from '@angular/core';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function(state, action) {
        console.log('state', state);
        console.log('action', action);
        return reducer(state, action);
    };
}
export const metaReducers: MetaReducer<any>[] = [debug];


@NgModule({
    imports: [StoreModule.forRoot({appRoot: appReducer}, { metaReducers }), MenuStoreModule],
})
export class AppStoreModule {}
