import { Injectable } from '@angular/core';
import {never, Observable} from 'rxjs';
import {catchError, finalize, map,delay} from 'rxjs/internal/operators';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {RESTFUL_RESOURCE_ENDPOINT} from '../configs/resource.config';
import {CommonService} from './common.service';
import {RES_CODE} from '../configs/code';
import {HttpEvent} from '@angular/common/http/src/response';
import {empty} from 'rxjs/internal/Observer';


interface IResponse {
    code: number;
    information: string;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class HttpResourceService {
    requestOptionsArgs: any = {
        headers: {
            'Version-Info': 'client_type=app; web_version=1.0.0; app_version=1.0.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': RESTFUL_RESOURCE_ENDPOINT
        }
    };
    private _baseURL = RESTFUL_RESOURCE_ENDPOINT;
    constructor(private http: HttpClient, private commonService: CommonService) { }
    request(method: string, url: string | Request, options): Observable<any> {
        this.commonService.showLoading();
        return this.http.request(method, this._baseURL + url, Object.assign({}, this.requestOptionsArgs, options)).pipe(
            finalize(() => this.commonService.closeLoading())
        );
    }
    get(url: string, options?): Observable<any> {
        return this.http.get<HttpResponse<any>>(this._baseURL + url, Object.assign({}, this.requestOptionsArgs, options));
    }
    post(url: string, body: any, options = {}, loadingOptions = true, toastOptions = true): Observable<any> {
        console.log('post-' + url, this.requestOptionsArgs);
        return this.httpProxy(this.http.post(this._baseURL + url, body, Object.assign({}, this.requestOptionsArgs, options))
            , loadingOptions, toastOptions).pipe(
            map(r => {
                console.log('post-' + url + 'success:', r);
                return r;
            })
        );
    }
    // 类型判断一直报错,拎出来
    httpProxy(http: Observable<any>, loadingOptions: boolean , toastOptions: boolean) {
        if (loadingOptions) {
            this.commonService.showLoading();
        }
        return http.pipe(
            delay(500),  // 测试loading状态
            map(res => {
              console.log('proxy res', res)
                if (loadingOptions) {
                    this.commonService.closeLoading();
                }
                if (res.code === RES_CODE.SUCCESS) {
                    return res;
                } else {
                    throw new Error(res.information);
                }
            }), catchError(error => {
                if (toastOptions) {
                    this.commonService.errorTip(error.message);
                }
                return Observable.create(ob => ob.error(error.message));
            })
        );
    }

    setBaseUrl(url: string) {
        this._baseURL = url;
        this.requestOptionsArgs.headers['Access-Control-Allow-Origin'] = url;
    }

    getBaseUrl() {
        return this._baseURL;
    }
}
