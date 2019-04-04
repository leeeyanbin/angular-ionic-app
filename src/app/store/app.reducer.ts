import {Action, createSelector} from '@ngrx/store';
import { ActionTypes } from './app.actions';

export const initialState = {
    menuStatus: false,
    appInitStatus: false
};
export function appReducer(state = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.UPDATE_MENU_LOCAL:
            return {...state, menuStatus: true};
        case ActionTypes.INIT_APP_SUCCESS:
            return {...state, appInitStatus: true};
        default:
            return state;
    }
}
