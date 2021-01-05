import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-assent',
  templateUrl: './assent.component.html',
  styleUrls: ['./assent.component.css']
})
export class AssentComponent implements OnInit {

  assentForm: FormGroup;
  @Output() onSaveClick = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              private gameService: GameService,
              public router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.assentForm = this.formBuilder.group({
      assent: [false, Validators.requiredTrue]
    });
  }

  get assentFormControls(): any {
    return this.assentForm['controls'];
  }

  save() {
    console.log(this.assentForm.value);
    this.authService.updateProgress({"assent": true});
    this.gameService.stage = 'initial';
  }

}
