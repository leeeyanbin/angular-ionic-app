import { Action } from '@ngrx/store';

export enum ActionTypes {
    UPDATE_MENU_LOCAL = '[APP ROOT] update menu from local storage',
    INIT_APP_SUCCESS = '[APP ROOT] init app success'
}

export class UpdateMenuLocal implements Action {
    readonly type = ActionTypes.UPDATE_MENU_LOCAL;
}

export class InitAppSuccess implements Action {
    readonly type = ActionTypes.INIT_APP_SUCCESS;
}
