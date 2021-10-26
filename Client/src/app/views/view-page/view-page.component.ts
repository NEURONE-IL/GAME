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
  }

  trackIFrame() {
    if(this.isInited) {
      this.iFrameKmTracker.start();
    }
  }

  ngOnDestroy() {
    this.iFrameKmTracker.stop();
  }

}
