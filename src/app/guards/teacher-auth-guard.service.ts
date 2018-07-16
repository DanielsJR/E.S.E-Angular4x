import { LoginService } from '../login/login.service';
import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    NavigationExtras,
    Route,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { ROLE_TEACHER } from '../app.config';


@Injectable()
export class TeacherAuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private loginService: LoginService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        console.log('TeacherAuthGuard#canActivate called');
        return this.checkLogin(url);
        //return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        const roles = this.loginService.getRoles();
        if (roles.includes(ROLE_TEACHER)) {
            console.log('checkLogin: true');
            return true;
        } else {
            console.log('checkLogin: false');
            // Store the attempted URL for redirecting
            this.loginService.redirectUrl = url;
            this.router.navigate(['/login']);
            return false;
        }
    }


}
