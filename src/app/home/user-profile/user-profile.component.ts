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
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UserStoreService } from '../../services/user-store.service';
import { UserStore2Service } from '../../services/user-store2.service';


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

    isLoading = false;


    constructor(
        private formBuilder: FormBuilder, private userBackendService: UserBackendService,
        private userLoggedService: UserLoggedService,
        public sanitizer: DomSanitizer, private snackbarService: SnackbarService,
        private userStoreService: UserStoreService,
        private userStoreService2: UserStore2Service
    ) { }

    ngOnInit() {
        this.buildForm();

    }

    buildForm() {

        this.editProfileForm = this.formBuilder.group({
            id: [this.user.id],
            username: [{ value: this.user.username, disabled: true }],
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
                this.avatar.setValue({
                    name: files.name,
                    type: files.type,
                    data: (reader.result as string).split(',')[1]
                })
            };
        }
        this.avatar.markAsDirty();
    }

    resetAvatar() {
        this.avatar.setValue(this.user.avatar);
        this.avatar.markAsPristine();
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
        this.isLoading = true;
        this.editProfileForm.value.username = this.username.value;
        this.editProfileForm.value.birthday = (this.editProfileForm.value.birthday != null) ? moment(this.editProfileForm.value.birthday).format('DD/MM/YYYY') : null;
        this.editProfileForm.value.gender = (this.editProfileForm.value.gender != null) ? this.editProfileForm.value.gender.toUpperCase() : null;
        this.editProfileForm.value.commune = (this.editProfileForm.value.commune != null) ? this.editProfileForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
        this.editProfileForm.value.dni = (this.dni.value === "") ? null : this.dni.value;
        this.editProfileForm.value.mobile = (this.mobile.value === "") ? null : this.mobile.value;
        this.editProfileForm.value.email = (this.email.value === "") ? null : this.email.value;
        this.editProfileForm.value.address = (this.address.value === "") ? null : this.address.value;
        //this.user = this.editProfileForm.value;
        let userEdit: User = this.editProfileForm.value;
        this.userBackendService.updateSecured(userEdit)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(user => {
                this.userLoggedService.userLogged(user);
                if (this.fileInput) this.fileInput.clear();
                this.editProfileForm.markAsPristine();
                //this.userStoreService.updateManagerInStore(user);
                //this.userStoreService.updateTeacherInStore(user);
                this.userStoreService2.updateInManagerDataStore(user);
                this.userStoreService2.updateInTeacherDataStore(user);

             
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.snackbarService.openSnackBar(error.error.message, 'error');
                } else {
                    this.snackbarService.openSnackBar('Error al actualizar usuario', 'error');
                }
            }, () => {
                this.snackbarService.openSnackBar('Datos Actualizados', 'success');
            }
            );

    }



}
