import { Action , createSelector} from '@ngrx/store';
import { ActionTypes } from './menu.actions';
import {ActionReducer} from '@ngrx/store/src/models';
import {Init} from './menu.actions';
// interface  IMenuConfig {
//     icon: String;
// }
// interface IMenuItem {
//     [propName: string]: Boolean|IMenuConfig;
// }
//
// declare type MenuState ()= {
//
//     };
// interface IMenuState {
//     menuMapper: ;
//     menuKeyList: string[];
// }
export const initialState = {
    menuMapper: {},
    menuList: [],
    menuKeyList: [],
    updateTime: ''
};
export function menuReducer(state = initialState, action: Init) {
    switch (action.type) {
        case ActionTypes.INIT:
            const menus  = action.para.menuList || [];
            const updateTime = action.para.updateTime;
            const res = {};
            const resArray = [];
            const menuList = [];
            menus.forEach( (e, i) => {
                res[e] = i;
                resArray.push(e);
                menuList.push(e);
            });
            return {
                menuMapper: res,
                menuKeyList: resArray,
                menuList : menuList,
                updateTime : updateTime
            };
        default:
            return state;
    }
}

interface ImenuState {
    menuMapper: any;
    menuKeyList: string[];
    menuList: any[];
    updateTime: string;
}

interface AppState {
    menu: ImenuState;
}
const selectFeature = (state: AppState) => state.menu;

export const selectMenus = createSelector(
    selectFeature,
    (state: ImenuState) => state.menuList[0].children
);
