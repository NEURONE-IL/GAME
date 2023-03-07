import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Event, ParamMap, Router } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { environment } from 'src/environments/environment';
import { StoreQueryService } from 'src/app/services/logger/store-query.service';
import { GameService } from 'src/app/services/game/game.service';
import { TranslateService } from '@ngx-translate/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchResultComponent implements OnInit {
  query: string;
  domain: string;
  documents = [];
  searching: boolean;
  BaseUrl = environment.serverRoot;
  homeTooltip: string;

  //paginacion
  documentsPaginated=[]
  totalDocuements=0;
  pages=1;
  pageIndex=[];
  activePage=0;
  selected = new FormControl(0);

  documentsWeb = [];
  documentsVideo = [];
  documentsImages = [];
  constructor(
    protected endpointsService: EndpointsService,
    private route: ActivatedRoute,
    public gameService: GameService,
    public router: Router,
    private storeQueryService: StoreQueryService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.searching = true;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.query = params.get('query');
      this.domain = params.get('domain');
    });
    this.activePage= this.gameService.getActivePage();
    this.homeTooltip = this.translate.instant("GAME.SEARCH.TOOLTIP");
    this.setTab();
    let subscription = this.endpointsService
      .getDocuments(this.query, this.domain)
      .subscribe(
        (data: []) => {
          // Success
          this.documents = data;

          this.documents = this.endpointsService.sort(this.documents, this.gameService.challenge._id)

          //
          //paginacion
          //
          let doc;
          let documentosTexto=[];

          this.documentsPaginated=[];
          this.totalDocuements=0;
          this.pages=1;
          this.pageIndex=[];

          //se obtienen los documentos que son de texto o pdfs
          for (doc of this.documents){
            if (!doc.type || doc.type=='book'){documentosTexto.push(doc)}
          }
          //calcula número de paginas de resultados
          this.pages = Math.floor(documentosTexto.length/10);
          this.totalDocuements= documentosTexto.length;
          if(documentosTexto.length%10>0){this.pages=this.pages+1};
          let pagina=[];
          for (doc in documentosTexto){
            pagina.push(documentosTexto[doc])
            if(pagina.length==10) {
              this.documentsPaginated.push(pagina);
              pagina = []
            }
          }
          if(pagina.length>0) {
            this.documentsPaginated.push(pagina);
          }
          console.log("documentos Paginados", this.documentsPaginated)
          //pageIndex
          for (let i=0; i<this.pages;i++){
            this.pageIndex.push(i+1)
          }

          this.filterTypes();
          //finalizar loading
          this.searching = false;

        },
        (error) => {
          console.error(error);
        }


      );
  }

  changePageTo(numberOfPageActive){
    /*Dispatch changepage event*/
    var evt = new CustomEvent('changepage', { detail: 'To page ' + numberOfPageActive });
    window.dispatchEvent(evt);
    /*End dispatch changepage event*/
    this.activePage=numberOfPageActive-1;
    console.log("active page= ", this.activePage)
  }

  previousPage(){
    if (this.activePage>0){
      /*Dispatch previouspage event*/
      var evt = new CustomEvent('previouspage', { detail: 'To page ' + this.activePage });
      window.dispatchEvent(evt);
      /*End dispatch previouspage event*/
      this.activePage=this.activePage-1;
    }
    console.log("active page= ", this.activePage)
  }

  nextPage(){
    if (this.activePage<this.pages-1){
      /*Dispatch nextpage event*/
      var evt = new CustomEvent('nextpage', { detail: 'To page ' + (this.activePage + 2) });
      window.dispatchEvent(evt);
      /*End dispatch nextpage event*/
      this.activePage=this.activePage+1;
    }
    console.log("active page= ", this.activePage)
  }

  changeTab(event: MatTabChangeEvent){
    switch(event.index){
      case 0:
        localStorage.setItem('lastTab', 'webpages');
        this.changeToWebPagesTab();
        break;
      case 1:
        localStorage.setItem('lastTab', 'images');
        this.changeToImagesTab();
        break;
      case 2:
        localStorage.setItem('lastTab', 'videos');
        this.changeToVideosTab();
        break;
    }
  }


  filterTypes() {
    this.documentsVideo = this.documents.filter( x => x.type === 'video');
    this.documentsImages = this.documents.filter( x => x.type === 'image');
    this.documentsWeb = this.documents.filter( x => x.type === 'book' || !x.type);
  }

  changeToWebPagesTab(){
    /*Dispatch changetowebpagestab event*/
    var evt = new CustomEvent('changetowebpagestab');
    window.dispatchEvent(evt);
    /*End dispatch changetowebpagestab event*/
  }

  changeToImagesTab(){
    /*Dispatch changetoimagestab event*/
    var evt = new CustomEvent('changetoimagestab');
    window.dispatchEvent(evt);
    /*End dispatch changetoimagestab event*/
  }

  changeToVideosTab(){
    /*Dispatch changetovideostab event*/
    var evt = new CustomEvent('changetovideostab');
    window.dispatchEvent(evt);
    /*End dispatch changetovideostab event*/
  }

  search() {
    if (this.query !== '' && this.query!== '*') {
      let queryData = {
        query: this.query,
        title: document.title,
        url: this.router.url,
        localTimeStamp: Date.now(),
      };
      this.storeQueryService.postQuery(queryData);
      this.router
        .navigate(['/session'], { skipLocationChange: true })
        .then(() => {
          this.gameService.setActivePage(0);
          this.router.navigate([
            'session/search-result',
            this.query,
            this.domain]
            );
        }
        );
    }
  }

  getParameterByName(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(url);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  getThumbnail(youtubeUrl) {
    let thumb = this.getParameterByName(youtubeUrl, 'v');
    let thumbUrl = 'http://img.youtube.com/vi/' + thumb + '/default.jpg';
    return thumbUrl;
  }

  showShortDescription(description, num) {
    return description.substr(0, num);
  }

  setTab(){
    var lastTab = localStorage.getItem('lastTab')
    switch (lastTab) {
      case 'webpages':
        this.selected.setValue(0);        
        break;
      case 'images':
        this.selected.setValue(1);          
        break;
      case 'videos':
        this.selected.setValue(2);          
        break;
    }
    localStorage.removeItem('lastTab');    
  }
}