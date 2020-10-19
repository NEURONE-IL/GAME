import { Component, OnInit } from '@angular/core';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  query: string;
  documents = [{
    "_id": "3R825ZFnCnsdENTxP",
    "docName": "canal 13",
    "title": "canal 13",
    "locale": "en-US",
    "relevant": false,
    "task": [
        "a"
    ],
    "domain": [
        "sdadsa"
    ],
    "keywords": [
        "canal 13"
    ],
    "date": "Sun Oct 18 2020 20:49:36 GMT-0300 (-03)",
    "url": "https://www.13.cl",
    "searchSnippet": "* T13  * Deportes <em class=\"hl\">13</em>  * AR13  * 13C  * RecTV  * <em class=\"hl\">13</em> Comparte  * <em class=\"hl\">13</em> ...  historia  BrujasHumberto está en riesgo vital Hoy en el <em class=\"hl\">13</em> Ver toda la ...  Bienvenidos   9.   12:45 Franja electoral   10.  <em class=\"hl\">13</em>:00 Teletrece Tarde   11.  14",
    "route": "assets/downloadedDocs/canal 13/www.13.cl/index.html",
    "hash": "d4e6dd28d201aaaa1432e7a62606fedd6def097078aded06b571ddc3410d036a"
},
{
    "_id": "vHA4ve8hto4oMWPAD",
    "docName": "Usain Bolt wikipedia",
    "title": "Usain Bolt wikipedia",
    "locale": "en-US",
    "relevant": false,
    "task": [
        "a"
    ],
    "domain": [
        "sdadsa"
    ],
    "keywords": [
        "l2"
    ],
    "date": "Sat Oct 17 2020 22:59:26 GMT-0300 (-03)",
    "url": "https://en.wikipedia.org/wiki/Usain_Bolt",
    "searchSnippet": " sprinter of all time.[<em class=\"hl\">13</em>][14][15] He is a world record holder in the 100 ...  Circuit wins          * 10 See also  * 11 Notes  * 12 References  * <em class=\"hl\">13</em>",
    "route": "assets/downloadedDocs/Usain Bolt wikipedia/en.wikipedia.org/wiki/Usain_Bolt/index.html",
    "hash": "9f226af17623adf3a284d4a393728f703390fee600bc380a05526e66bd7f2ccb",
    "snippet": "xd"
  }];
  constructor(protected endpointsService: EndpointsService ) { }

  ngOnInit(): void {
    /*this.endpointsService.getDocuments("13", "en-US", "task", "sdadsa").subscribe((data: []) => { // Success
      console.log(data)
      this.documents = data;
    },
    (error) => {
      console.error(error);
    });*/
  }

}
