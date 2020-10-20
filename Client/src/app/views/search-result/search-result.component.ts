import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  query: string;
  documents = [{
    "_id": "GoGcYBqXuvMp9HHyz",
    "docName": "minecraft",
    "title": "minecraft",
    "locale": "es-CL",
    "relevant": false,
    "task": [
        "task1"
    ],
    "domain": [
        "domain1"
    ],
    "keywords": [
        "minecraft"
    ],
    "date": "Tue Oct 20 2020 01:59:39 GMT-0300 (-03)",
    "url": "https://es.wikipedia.org/wiki/Minecraft",
    "searchSnippet": "Minecraft De Wikipedia, la enciclopedia libreIr <em class=\"hl\">a</em> la navegaciónIr <em class=\"hl\">a</em> la ...  también la de PlayStation Vita. <em class=\"hl\">A</em> septiembre de 2014 se habían vendido más de ...  objetivo específico, permitiéndole al jugador una gran libertad en cuanto <em class=\"hl\">a</em> la",
    "route": "assets/downloadedDocs/minecraft/es.wikipedia.org/wiki/Minecraft/index.html",
    "hash": "7d0a13b31ec1b3a79678ba7322062c77df56c9a57de9a6651476b8b8c591af20"
},
{
    "_id": "aQzuYgCH5tHimx9kB",
    "docName": "retroalimentacion",
    "title": "retroalimentacion",
    "locale": "es-CL",
    "relevant": false,
    "task": [
        "task1"
    ],
    "domain": [
        "domain1"
    ],
    "keywords": [
        "retro"
    ],
    "date": "Tue Oct 20 2020 02:03:11 GMT-0300 (-03)",
    "url": "https://es.wikipedia.org/wiki/Realimentación",
    "searchSnippet": "Título incorrecto Ir <em class=\"hl\">a</em> la navegaciónIr <em class=\"hl\">a</em> la búsquedaEl título de la ...  página solicitada contiene una secuencia UTF-8 no válida.  Volver <em class=\"hl\">a</em>",
    "route": "assets/downloadedDocs/retroalimentacion/es.wikipedia.org/wiki/Realimentación/index.html",
    "hash": "8d759fd061386385de4b21e370522fc56e3582aec465bddb1d944547caa1c498"
}];
  constructor(protected endpointsService: EndpointsService, private route: ActivatedRoute, public router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.query = params.get('query');
      });
    /*this.endpointsService.getDocuments("13", "en-US", "task", "sdadsa").subscribe((data: []) => { // Success
      console.log(data)
      this.documents = data;
    },
    (error) => {
      console.error(error);
    });*/
  }

  search(){
    if(this.query !== ''){
      this.router.navigate(['session/search-result', this.query]);
    }
  }

}
