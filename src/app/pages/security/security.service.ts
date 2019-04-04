import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpResourceService} from '../../service/http-resource.service';
import {RESTFUL_RESOURCES} from '../../configs/resource.config';

@Injectable({ providedIn: 'root'})
export class SecurityService {

  constructor(private http: HttpResourceService) { }

  login(params): Observable<any> {
    return this.http.post(RESTFUL_RESOURCES.SECURITY.LOGIN, params);
  }
  logout(): Observable<any> {
      return this.http.post(RESTFUL_RESOURCES.SECURITY.LOGOUT, {});
  }
}
