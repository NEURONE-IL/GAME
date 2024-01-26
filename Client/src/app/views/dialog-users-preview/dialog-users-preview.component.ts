import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-users-preview',
  templateUrl: 'dialog-users-preview.component.html',
  styleUrls: ['./dialog-users-preview.component.css'],
})
export class DialogUsersPreviewComponent implements OnInit, OnDestroy {
  @Input() flow: string;
  users: any[] = [];
  displayedColumns: string[] = ['name', 'email'];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private router: Router,
    public matDialog: MatDialog
  ) {
    console.log(this.data);
  }

  ngOnInit(): void {
    let start = this.data.paramStart;
    let end = start + this.data.paramUsers;
    let sufix = this.data.paramEmailSubfix;
    let prefix = this.data.paramEmailPrefix;
    let name = this.data.paramName;
    for (let i = start; i <= end; i++) {
      let id = '';
      if (i < 10) {
        id += '00' + i;
      } else if (i >= 10 && i < 100) {
        id += '0' + i;
      } else {
        id += i;
      }
      this.users.push({ email: prefix + id + '@' + sufix, name: name + id });
    }
  }

  ngOnDestroy(): void {}

  closeDialog() {
    this.matDialog.getDialogById('app-dialog-users-preview').close();
  }
}
