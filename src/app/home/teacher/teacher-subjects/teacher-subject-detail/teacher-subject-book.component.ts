import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../../app.config';


@Component({
  template: `
  <nx-subject-book [areaRole]= "areaRole"></nx-subject-book>
  `,
  styles:['']
})
export class TeacherSubjectBookComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}