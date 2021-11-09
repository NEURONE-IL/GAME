import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { KmTrackerServiceIframe } from 'src/app/services/logger/km-tracker-iframe.service';
import { environment } from 'src/environments/environment';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private route: ActivatedRoute,
              public gameService: GameService,
              private iFrameKmTracker: KmTrackerServiceIframe) { }

  ngAfterViewInit(): void {
    this.isInited = true;
  }

  url: string;
  docUrl: string;
  title: string;
  result: string;
  cleanURL: string;  

  iframeLoaded = false;
  isInited = false;
  pageContent;


  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.url = params.get('url');
        this.title = params.get('title');
        this.result = params.get('result_index');
        this.gameService.setActivePage(params.get('result_page'));
        console.log("RESULT", this.result);
        this.docUrl = environment.serverRoot + this.url;
        console.log(this.docUrl);
        console.log('docurl: ',this.docUrl);
      });
      /*Clean URL*/
      //URL example: http://localhost:4200/session/view-page/2004%20Bahrain%20Grand%20Prix/assets%2FdownloadedDocs%2FBahrain%2Fen.wikipedia.org%2Fwiki%2F2004_Bahrain_Grand_Prix%2Findex.html
      const titleArray = window.location.href.split('/');
      //Get docURL
      let rawUrl = decodeURIComponent(titleArray[6]);
      //Remove the URL prefix from NEURONE Core
      const urlArray = rawUrl.split('/');
      let docURL = '';
      for(var i=3; i<urlArray.length; i++){
        docURL += urlArray[i] + '/';
      }
      //Remove the URL postfix from NEURONE Core
      docURL = docURL.split(';')[0];
      this.cleanURL = docURL.replace('/index.html', '');
      /*End Clean URL*/
      /*Dispatch pageenter event*/
      var evt = new CustomEvent('pageenter', { detail: 'Enter to "' + this.cleanURL + '"' });
      window.dispatchEvent(evt);
      /*End dispatch pageenter event*/
  }

  trackIFrame() {
    if(this.isInited) {
      this.iFrameKmTracker.start();
    }
  }

  ngOnDestroy() {
    /*Dispatch pageexit event*/
    var evt = new CustomEvent('pageexit', { detail: 'Exit from "' + this.cleanURL + '"' });
    window.dispatchEvent(evt);
    /*End dispatch pageexit event*/    
    this.iFrameKmTracker.stop();
  }

}
