
import { UserService } from '../shared/services/users.service';
import { LoginModule } from '../login/login.module';
import { PageNotFoundComponent } from '../error-pages/page-not-found.component';
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CoreRoutingModule } from './core-routing.module';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';
import { ShellComponent } from './shell/shell.component';
import { MainContentComponent } from './shell/main-content/main-content.component';
import { HttpClientModule } from '@angular/common/http';
import { HTTPService } from '../services/http.service';

import { HomeModule } from '../home/home.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../shared/interceptors/auth-interceptor.interceptor';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { UserStoreService } from '../shared/services/user-store.service';




@NgModule({
  imports: [
    SharedModule,
    HomeModule,
    LoginModule,
    CoreRoutingModule,
    HttpModule,
    HttpClientModule
  ],

  declarations: [
    ShellComponent,
    MainContentComponent,
    PageNotFoundComponent,

  ],

  providers: [
    HTTPService,
    LocalStorageService,
    UserStoreService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }

  ],

  exports: [
    ShellComponent
  ]
})

export class CoreModule {
  // Prevent reimport of the CoreModule
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
