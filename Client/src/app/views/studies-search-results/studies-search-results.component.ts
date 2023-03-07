import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { GamificationService } from 'src/app/services/game/gamification.service';
import { Study, StudyService } from '../../services/game/study.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { StudySearchService, StudySearch } from 'src/app/services/admin/study-search.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface Paginator {
  totalDocs: number,
  perPages: number,
}

@Component({
  selector: 'app-studies-search-results',
  templateUrl: './studies-search-results.component.html',
  styleUrls: ['./studies-search-results.component.css'],
})

export class StudiesSearchResultsComponent implements OnInit {


  constructor(private authService: AuthService,
    private gamificationService: GamificationService,
    private router: Router,
    private route: ActivatedRoute,
    private studyService: StudyService,
    private studySearchService: StudySearchService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) { }

  actualQuery: string = "";
  studies: Study[] = [];
  paginator: Paginator = {
    totalDocs: 8,
    perPages: 8,
  }
  pageEvent: PageEvent;
  filters: any = {competences:[], levels: [], languages:[]};
  allFilters: any = {competences:[], levels: [], languages:[]};

  ngOnInit(): void {
    let searchTerm = this.route.snapshot.paramMap.get('term');
    this.getStudiesResults(searchTerm, 1);
  }

  getStudiesResults(searchTerm, page) {
    this.actualQuery = searchTerm;
    let _user_id = this.authService.getUser()._id
    //console.log(searchTerm);
    //console.log(this.filters);
    //console.log(this.allFilters);
    this.studySearchService.searchStudies(_user_id, searchTerm, page,{filters:this.filters, allFilters:this.allFilters}).subscribe(
      response => {
        let studies: Study[] = []
        this.paginator.totalDocs = parseInt(response.totalDocs);
        let docs = response.docs
        docs.forEach(doc => { studies.push(doc.study) })
        this.studies = studies;
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

  }
  getCover(index: number): string {
    return '../../../assets/study-images/Study0' + (index % 8 + 1) + '.jpg';
  }
  showShortDescription(description) {
    return (description.substr(0, 40));
  }
  //@Output() studySelected: EventEmitter<string>= new EventEmitter();
  clickedStudy(id) {
    let link = '/studies_search/study/' + id;
    this.router.navigate([link]);

    //this.studySelected.emit(link);
    /* this.router.navigate([link]); */
  }

  actualStudy = '';
  fullStudy(study) {
    this.actualStudy = study._id;
  }
  @ViewChild('studiesPaginator') studiesPaginator: MatPaginator;
  pageTurn(event) {
    this.getStudiesResults(this.actualQuery, event.pageIndex + 1)
  }
  shortStudy(study) {
    this.actualStudy = '';
  }

  getPublicStudies(term: string, filters: any, allFilters: any) {
    console.log(term)

    this.router.navigate(['studies_search/results/' + term]);

    if (this.studiesPaginator !== undefined)
      this.studiesPaginator.firstPage();
    
    this.filters = filters;
    this.allFilters = allFilters;
    this.getStudiesResults(term, 1)

  }

  getCurrentQuery(filters: any, allFilters: any) {

    if (this.studiesPaginator !== undefined)
      this.studiesPaginator.firstPage();

    this.filters = filters;
    this.allFilters = allFilters;
    this.getStudiesResults(this.actualQuery, 1)

  }


}