import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StoreLinkService } from './services/logger/store-link.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Question Game';

  constructor(public translate: TranslateService,
              private router: Router,
              private storeLink: StoreLinkService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if(localStorage.getItem('lastUrl')){
          let visitedLink = {
            url: localStorage.getItem('lastUrl'),
            state: 'PageExit',
            title: document.title,
            localTimeStamp: Date.now(),
            localTimeStampNumber: Date.now()
          }
          this.storeLink.postVisitedLink(visitedLink);
        }
        localStorage.setItem('lastUrl', event.url)
      }

      if (event instanceof NavigationStart) {
        let visitedLink = {
          url: event.url,
          state: 'PageEnter',
          title: document.title,
          localTimeStamp: Date.now(),
          localTimeStampNumber: Date.now()
        }
        this.storeLink.postVisitedLink(visitedLink);
      }

      if (event instanceof NavigationError) {
          console.log(event.error);
      }

  });
    this.translate.addLangs(['es-CL', 'en-US']);
    //Se usa la traducción a español si el navegador está en español
    if(navigator.language.split('-')[0] === 'es'){
      this.translate.use('es-CL');
    }
    //Si no por defecto se usa la traducción a inglés(ESPAÑOL?)
    else{
      this.translate.use('es-CL');
    }
  }
}
