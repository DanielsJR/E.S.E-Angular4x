import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';
import { UserBackendService } from './user-backend.service';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserLoggedService {

    private userLoggedSource = <BehaviorSubject<User>>new BehaviorSubject(null);//new ReplaySubject<User>(1);// new Subject<User>();
    userLogged$ = this.userLoggedSource.asObservable();

    constructor(private userBackendService: UserBackendService, private loginService: LoginService,
        private router: Router) { }

    userLogged(user: User) {
        console.log('userLogged NEXT....');
        this.userLoggedSource.next(user);
    }

    getUserFromBackEnd(username: string, redirectHome: boolean): Observable<User> {
        return this.userBackendService
            .getUserByUsernameSecured(username)
            .pipe(
                tap(user => {
                    this.userLogged(user);
                    const endPoint = this.loginService.getPrivilege().toLocaleLowerCase();
                    if (redirectHome) this.router.navigate(['/home/' + endPoint]);
                    if (this.loginService.redirectUrl && (this.loginService.tokenUsername === username)) this.router.navigate([this.loginService.redirectUrl]);
                }, error => {
                    console.error(`could not load user, ${error.message}`);
                }
                ));


    }

}