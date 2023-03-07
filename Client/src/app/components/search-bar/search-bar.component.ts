import { Component, OnInit, Injector, Input } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { StudyResourcesService } from 'src/app/services/admin/study-resources.service';
import { FormControl } from '@angular/forms';
import { StudiesSearchResultsComponent } from 'src/app/views/studies-search-results/studies-search-results.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  name: string;
  search : string = "";
  levels: any[] = [];
  languages : any[];
  competences: any[];
  resultsComponent: StudiesSearchResultsComponent;

  levelsSelected: string[] = [];
  languagesSelected : any[] = []
  competencesSelected: any[] = [];
  notFilter:boolean = true;
  allFilters: any = {competences:[], languages:[] , levels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']};
  
  @Input() results: any[];
  @Input() componentReference: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studyResourcesService: StudyResourcesService,
  ) { }

  ngOnInit(): void {
    console.log('init')
    let path = this.router.routerState.snapshot.url.split('/')[2]
    if (path === 'results')
      this.name = path 

      for (let i = 0; i < 12; i++) {
        let el = {name: (i+1).toString(), check: false}
        this.levels.push(el)
      }
      this.studyResourcesService.getCompetences().subscribe( response => {
      this.competences = response.competences;
      this.competences.sort( (a,b) => a.name.localeCompare(b.name))
      this.competences.forEach(el => {
        this.allFilters.competences.push(el.name)
        el.check = false;
      });
    }, err => {
      console.log(err)
    });

    this.studyResourcesService.getLanguages().subscribe( response => {
      this.languages = response.languages;
      this.languages.sort( (a,b) => a.name.localeCompare(b.name))
      this.languages.forEach(el => {
        this.allFilters.languages.push(el.name);
        el.check = false;
      });

    }, err => {
      console.log(err)
    });
    
  }
  async searchFlows(query: string){
    this.name = 'results';

    if(query === '' || query === null || query === undefined )
      query = 'all'
    this.router.navigate(['studies_search/results/'+query]);
    console.log(this.allFilters);

    if(this.componentReference){
      this.name = this.componentReference.route.url.value[0].path;
      if (this.name === 'results'){
        this.resultsComponent = this.componentReference;
        let currentFilters = {competences: this.competencesSelected, levels:this.levelsSelected, languages:this.languagesSelected}
        this.resultsComponent.getPublicStudies(query,currentFilters, this.allFilters);
      }
    }
    
    this.search = "";
  }
  filterFlows(filter){
    if(!filter){
      this.levelsSelected = [];
      this.languagesSelected = [];
      this.competencesSelected = [];
      this.competences.forEach(comp => {
        comp.check = false;
      });
      this.levels.forEach(lvl => {
        lvl.check = false;
      });
      this.languages.forEach(lang => {
        lang.check = false;
      });
    }
    let currentFilters = {competences: this.competencesSelected, levels:this.levelsSelected, languages:this.languagesSelected}

    if(this.componentReference){
      this.name = this.componentReference.route.url.value[0].path;
      if (this.name === 'results'){
        this.resultsComponent = this.componentReference;
        this.resultsComponent.getCurrentQuery(currentFilters, this.allFilters);
      }
    }
    this.search = "";
  }
  onActivate(componentReference) {
    this.name = componentReference.route.url.value[0].path;
    if (this.name === 'results'){
      this.resultsComponent = componentReference;
    }
  }
  addCompetence($event){
    let value = $event.source.value
    if($event.checked)
      this.competencesSelected.push(value);

    else{
      let index = this.competencesSelected.findIndex( comp => comp._id === value);
      this.competencesSelected.splice(index,1)
    }
    console.log(this.competencesSelected)
  }
  addLevel($event){
    let value = $event.source.value
    if($event.checked)
      this.levelsSelected.push(value);

    else{
      let index = this.levelsSelected.findIndex( lvl => lvl === value);
      this.levelsSelected.splice(index,1)
    }
    console.log(this.levelsSelected)
  }
  addLanguage($event){
    let value = $event.source.value
    if($event.checked)
      this.languagesSelected.push(value);

    else{
      let index = this.languagesSelected.findIndex( lang => lang._id === value);
      this.languagesSelected.splice(index,1)
    }
    console.log(this.languagesSelected)
  }

}
