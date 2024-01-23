import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService, User } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Study, StudyService } from '../../services/game/study.service';
import { SignupConstants } from '../signup/signup.constants';
import { getRegiones, getComunasByRegion } from 'dpacl';
import { DialogUsersPreviewComponent } from 'src/app/views/dialog-users-preview/dialog-users-preview.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-user-creation-form',
  templateUrl: './user-creation-form.component.html',
  styleUrls: ['./user-creation-form.component.css'],
})
export class UserCreationFormComponent implements OnInit {
  userCreateForm: FormGroup;
  user: User;
  studies: Study[] = [];
  years: number[] = [];
  courses: any;
  regions: any;
  selectedRegion: any;
  communes: any;
  region = new FormControl('', Validators.required);
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private studyService: StudyService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog
  ) {
    this.courses = SignupConstants.courses;
    this.regions = getRegiones();
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.studyService.getStudiesByUser(this.user._id).subscribe(
      (response) => {
        this.studies = response['studies'];
        console.log(this.studies);
      },
      (err) => {
        this.toastr.error(
          this.translate.instant('STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR'),
          this.translate.instant('CHALLENGE.TOAST.ERROR'),
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          }
        );
      }
    );
    //Hacer un for desde 1950 hasta el año actual que el array empiece en en año actual

    const hoy = new Date();
    this.years = new Array(hoy.getFullYear() - 1950)
      .fill(hoy.getFullYear())
      .map((x, i) => -i + x);

    this.userCreateForm = this.formBuilder.group({
      paramStudy: ['', Validators.required],
      paramEmailPrefix: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z0-9.-]+'),
        ],
      ],
      paramEmailSubfix: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]*'),
        ],
      ],
      paramName: ['', [Validators.required, Validators.maxLength(50)]],
      paramInstitution: ['', [Validators.required, Validators.maxLength(75)]],
      paramBirthdayYear: ['', Validators.required],
      paramCourse: ['', Validators.required],
      paramCommune: ['', Validators.required],
      paramRegion: ['', Validators.required],
      paramStart: ['', [Validators.required, Validators.min(1)]],
      paramUsers: [
        '',
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
    });
  }
  get userCreateFormControls(): any {
    return this.userCreateForm['controls'];
  }
  registerUsers() {
    // tslint:disable-next-line:max-line-length
    if (!this.userCreateForm.valid) {
      this.toastr.error('Revise los campos del formulario', 'Error', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
      });
      this.userCreateForm.markAllAsTouched();
      return;
    }

    this.authService.createMultipleUsers(this.userCreateForm).subscribe(
      (response) => {
        console.log(response);
        this.toastr.error(
          'Los usuarios han sido creados exitosamente',
          'Usuarios Creados',
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          }
        );
      },
      (err) => {
        console.error(err);
        this.toastr.error('Ocurrió un error al crear los usuarios', 'Error', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });
      }
    );
  }

  onRegionChange(regionChange: any) {
    this.communes = getComunasByRegion(regionChange.value);
    // this.studentFormControls.institution_commune.enable();
  }

  openPreview() {
    this.matDialog.open(DialogUsersPreviewComponent, {
      id: 'app-dialog-users-preview',
      width: '60%',
      data: this.userCreateForm.value,
    });
  }
  closeDialog() {
    this.matDialog.getDialogById('app-user-creation-form').close();
  }
}
