import { Action } from '@ngrx/store';

export enum ActionTypes {
    INIT = '[MENU] INIT',
}

export class Init implements Action {
    readonly type = ActionTypes.INIT;
    constructor(public para: { menuList: any[]; updateTime: string }) {
    }
}

