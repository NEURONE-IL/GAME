import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { environment } from 'src/environments/environment';

let input = Input;

@Component({
  selector: 'app-admin-search-result',
  templateUrl: './admin-search-result.component.html',
  styleUrls: ['./admin-search-result.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminSearchResultComponent implements OnInit {

  @Input() query: string;
  @Input() domain: string;
  screenHeight: any;
  documents = [];
  BaseUrl = environment.serverRoot;

  //paginacion
  documentsPaginated=[]
  totalDocuements=0;
  pages=1;
  pageIndex=[];
  activePage=0;

  constructor(protected endpointsService: EndpointsService, private route: ActivatedRoute, public router: Router ) { }

  ngOnInit(): void {
    this.screenHeight = window.innerHeight;
    this.search();
  }

  changePageTo(numberOfPageActive){
    this.activePage=numberOfPageActive-1;
    console.log("active page= ", this.activePage)
  }
  previousPage(){
    if (this.activePage>0){
      this.activePage=this.activePage-1;
    }
    console.log("active page= ", this.activePage)
  }
  nextPage(){
    if (this.activePage<this.pages-1){
      this.activePage=this.activePage+1;
    }
    console.log("active page= ", this.activePage)
  }
  search(){
    this.endpointsService.getDocuments(this.query, this.domain)
      .subscribe((data: []) => { // Success
          this.documents = data;
          this.endpointsService.sort(this.documents, "task1");

          //
          //paginacion
          //
          let doc;
          let documentosTexto=[]

          this.documentsPaginated=[]
          this.totalDocuements=0;
          this.pages=1;
          this.pageIndex=[];
          this.activePage=0;

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

        },
        (error) => {
          console.error(error);
        });
  }

  getParameterByName(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  getThumbnail(youtubeUrl){
    let thumb = this.getParameterByName(youtubeUrl, 'v');
    let thumbUrl= 'http://img.youtube.com/vi/' + thumb + '/default.jpg';
    return thumbUrl;
  }

  showShortDescription(description, num){
    return (description.substr(0, num));
  }

}
