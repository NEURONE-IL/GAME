import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';

import { AuthInterceptorService } from './services/auth/auth-interceptor.service'
import { PdfViewerModule }  from  'ng2-pdf-viewer';
import { Ng9RutModule } from 'ng9-rut';
import { ValidateEqualModule } from 'ng-validate-equal';

import { AppComponent } from './app.component';
import { QuestionBarComponent } from './components/question-bar/question-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './views/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { StartComponent } from './views/start/start.component';
import { SearchComponent } from './views/search/search.component';
import { SearchResultComponent } from './views/search-result/search-result.component';
import { EndpointsService } from './services/endpoints/endpoints.service';
import { ViewPageComponent } from './views/view-page/view-page.component';
import { SafeurlPipe } from './services/safeurl/safeurl.pipe';
import { SessionComponent } from './views/session/session.component';
import { InitialQuestionaryComponent } from './views/initial-questionary/initial-questionary.component';
import { PreTestQuestionaryComponent } from './views/pre-test-questionary/pre-test-questionary.component';
import { PostTestQuestionaryComponent } from './views/post-test-questionary/post-test-questionary.component';
import { QuestionaryComponent } from './views/questionary/questionary.component';
import { ResourceUploadComponent } from './views/resource-upload/resource-upload.component';
import { StudyCreationComponent } from './views/study-creation/study-creation.component';
import { ChallengeCreationComponent } from './views/challenge-creation/challenge-creation.component';
import { UploadComponent } from './views/upload/upload.component';
import { CreationComponent } from './views/creation/creation.component';
import { ConsentComponent } from './components/consent/consent.component';
import { SignupComponent } from './views/signup/signup.component';
import { AdminPanelComponent } from './views/admin-panel/admin-panel.component';
import { ChallengeDisplayComponent } from './views/challenge-display/challenge-display.component';
import { StudyDisplayComponent } from './views/study-display/study-display.component';
import { StudiesDisplayComponent } from './views/studies-display/studies-display.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    QuestionBarComponent,
    HeaderComponent,
    LoginComponent,
    StartComponent,
    SearchComponent,
    SearchResultComponent,
    ViewPageComponent,
    SafeurlPipe,
    SessionComponent,
    InitialQuestionaryComponent,
    PreTestQuestionaryComponent,
    PostTestQuestionaryComponent,
    QuestionaryComponent,
    ResourceUploadComponent,
    StudyCreationComponent,
    ChallengeCreationComponent,
    UploadComponent,
    CreationComponent,
    SessionComponent,
    ConsentComponent,
    SignupComponent,
    AdminPanelComponent,
    ChallengeDisplayComponent,
    StudyDisplayComponent,
    StudiesDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatListModule,
    MatSelectModule,
    PdfViewerModule,
    Ng9RutModule,
    ValidateEqualModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AppRoutingModule,
  ],
  providers: [EndpointsService,
              {
              provide: HTTP_INTERCEPTORS,
              useClass: AuthInterceptorService,
              multi: true
              }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
