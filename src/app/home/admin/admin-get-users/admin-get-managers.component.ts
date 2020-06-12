import { Component, OnInit, } from '@angular/core';
import { ROLE_ADMIN, URI_MANAGERS } from '../../../app.config';


@Component({
  template: `<nx-users [uriRole] ="uriRole" [areaRole] ="areaRole"></nx-users>`,
  styles: [`
    :host  {
    display: block;
    width: 100%;
  }
  `]
})

export class AdminGetManagersComponent implements OnInit {
  
  uriRole = URI_MANAGERS;
  areaRole = ROLE_ADMIN;

  constructor() { }

  ngOnInit() {
  }

}


