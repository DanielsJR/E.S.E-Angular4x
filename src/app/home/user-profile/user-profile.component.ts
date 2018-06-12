import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GENDERS } from '../../models/genders';
import { DomSanitizer } from '@angular/platform-browser';
import { COMMUNNES } from '../../models/communes';
import * as moment from 'moment';
import { UserBackendService } from '../../services/user-backend.service';
import { SnackbarService } from '../../services/snackbar.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { TdFileInputComponent } from '@covalent/core';
import { noWhitespaceValidator } from '../../shared/validators/no-white-space-validator';
import { rutValidator } from '../../shared/validators/rut-validator';
import { NAME_PATTERN, PHONE_PATTERN } from '../../shared/validators/patterns';


@Component({
    selector: 'nx-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    @Input()
    user: User;

    @Input()
    uriRole: string;

    private _profileAction: string;

    get profileAction(): string { return this._profileAction; }

    @Input()
    set profileAction(profileAction: string) {
        this._profileAction = profileAction;

        this.profileActionTitle = (this.profileAction === 'usuario') ? 'Datos de Usuario' :
            (this.profileAction === 'personal') ? 'Datos Personales' : 'Datos de Contacto';

        this.title.emit(this.profileActionTitle);
    }


    @Output()
    title = new EventEmitter<string>();

    profileActionTitle: string = '';

    @Input()
    set isSidenavProfileOpen(isSidenavProfileOpen) {
        if (!isSidenavProfileOpen && this.editProfileForm) {
            if (this.fileInput) this.fileInput.clear();
            this.buildForm();
        }
    }


    editProfileForm: FormGroup;
    genders = GENDERS;
    compareFn: ((a1: any, a2: any) => boolean) | null = this.compareByViewValue;
    communes = COMMUNNES;

    files: File | FileList;

    @ViewChild(TdFileInputComponent)
    fileInput: TdFileInputComponent;


    constructor(private formBuilder: FormBuilder, private userService: UserBackendService,
        private userLoggedService: UserLoggedService,
        public sanitizer: DomSanitizer, private snackbarService: SnackbarService) { }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {

        this.editProfileForm = this.formBuilder.group({
            id: [this.user.id],
            username: [this.user.username, [Validators.required, noWhitespaceValidator]],
            //password: [],
            firstName: [this.user.firstName, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            lastName: [this.user.lastName, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            dni: [this.user.dni, [noWhitespaceValidator, rutValidator]],
            birthday: [(this.user.birthday != null) ? moment(this.user.birthday, 'DD/MM/YYYY') : null],
            gender: [this.user.gender],
            avatar: [this.user.avatar],
            mobile: [this.user.mobile, [Validators.pattern(PHONE_PATTERN), Validators.minLength(9), Validators.maxLength(9), noWhitespaceValidator]],
            email: [this.user.email, [Validators.email, noWhitespaceValidator]],
            address: [this.user.address, noWhitespaceValidator],
            commune: [this.user.commune],
            roles: [this.user.roles]

        });

    }

    selectEventEdit(files: FileList | File): void {
        let reader = new FileReader();
        if (files instanceof FileList) {

        } else {
            reader.readAsDataURL(files);
            reader.onload = () => {
                this.editProfileForm.get('avatar').setValue({
                    name: files.name,
                    type: files.type,
                    data: reader.result.split(',')[1]
                })
            };
        }
        this.editProfileForm.get('avatar').markAsDirty();
    }

    resetAvatar() {
        this.editProfileForm.get('avatar').setValue(this.user.avatar);
        this.editProfileForm.get('avatar').markAsPristine();
    }

    compareByViewValue(a1: any, a2: any) {
        // console.log('a1: ' + a1 + '    '+'a2: ' + a2);
        return a1 && a2 && a1 === a2;
    }


    // getters required
    get username() { return this.editProfileForm.get('username'); }
    get firstName() { return this.editProfileForm.get('firstName'); }
    get lastName() { return this.editProfileForm.get('lastName'); }
    get birthday() { return this.editProfileForm.get('birthday'); }
    get dni() { return this.editProfileForm.get('dni'); }
    get email() { return this.editProfileForm.get('email'); }
    get mobile() { return this.editProfileForm.get('mobile'); }
    get address() { return this.editProfileForm.get('address'); }
    get avatar() { return this.editProfileForm.get('avatar'); }

    save(): void {
        this.editProfileForm.value.birthday = (this.editProfileForm.value.birthday != null) ? moment(this.editProfileForm.value.birthday).format('DD/MM/YYYY') : null;
        this.editProfileForm.value.gender = (this.editProfileForm.value.gender != null) ? this.editProfileForm.value.gender.toUpperCase() : null;
        this.editProfileForm.value.commune = (this.editProfileForm.value.commune != null) ? this.editProfileForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
        this.editProfileForm.value.dni = (this.dni.value === "") ? null : this.dni.value;
        this.editProfileForm.value.mobile = (this.mobile.value === "") ? null : this.mobile.value;
        this.editProfileForm.value.email = (this.email.value === "") ? null : this.email.value;
        this.editProfileForm.value.address = (this.address.value === "") ? null : this.address.value;
        //this.user = this.editProfileForm.value;
        let userEdit: User = this.editProfileForm.value;
        this.userService.update(userEdit, this.uriRole).subscribe(user => {
            this.userLoggedService.userLogged(user);
            if (this.fileInput) this.fileInput.clear();
            this.editProfileForm.markAsPristine();
            this.openSnackBar('Datos Actualizados', 'success');
        },
            error => {
                this.openSnackBar(error, 'error');
                console.error('error updating user ' + error)
            });

    }

    openSnackBar(message: string, type: any): void {
        let data = {
            message: message,
            uriRole: 'none',
            type: type
        };

        let snackBarRef = this.snackbarService.openSnackBar(data);
    }


}