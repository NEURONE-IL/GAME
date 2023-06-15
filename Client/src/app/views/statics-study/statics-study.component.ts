import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

interface Metric {
  value: string;
  viewValue: string;
}

interface Student {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-statics-study',
  templateUrl: './statics-study.component.html',
  styleUrls: ['./statics-study.component.css']
})
export class StaticsStudyComponent implements OnInit {
  study$: any; // Variable para almacenar el estudio obtenido del servicio
  idStudy: string; // Variable para almacenar el id del estudio
  students: Student[] = [];
  selectedStudent: string;
  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.idStudy = this.route.snapshot.paramMap.get('study_id'); // Obtiene el id del estudio de la ruta
    console.log(this.idStudy)
    this.getStudyData(this.idStudy); // Llama al servicio con el id del estudio
    console.log(this.study$)
  }

  getStudyData(id: string): void {
    this.authService.getUsersByStudy(id).subscribe(
      (studyData:any) => {
        this.study$ = studyData;
        // procesar los datos del estudio para obtener los estudiantes
        this.students = studyData.users.map(user => {
          return {
            value: user._id,
            viewValue: user.names,
          };
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  selectedValue: string;
  selectedCar: string;

  metrics: Metric[] = [
    { value: 'Total Coverage', viewValue: 'Documentos Visitados' }, //NNúmero total de documentos diferentes visitados por el participante
    { value: 'Relevant Coverage', viewValue: 'Documentos Relevantes' }, //Número de documentos relevantes recuperados por el participante
    { value: 'Precision', viewValue: 'Precision' }, // Relación entre el número de documentos relevantes encontrados y el universo total de documentos diferentes visitados
    { value: 'Recall', viewValue: 'Recall' }, // Relación entre el número de documentos relevantes encontrados y el universo total de documentos relevantes
    { value: 'F-score', viewValue: 'F-Score' }, // Media armónica entre las métricas Precision y Recall
    { value: 'Useful-coverage', viewValue: 'Useful Coverage' }, // Número de documentos diferentes visitados durante un período superior a un cierto número de segundos, por defecto treinta
    { value: 'Number-queries', viewValue: 'Number of Queries' }, // Número de consultas realizadas por cada participante
    { value: 'Coverage-effectiveness', viewValue: 'Coverage Effectiveness' }, // Relación entre el número de documentos visitados en un tiempo superior a treinta segundos y el universo total de documentos visitados
    { value: 'Query-effectiveness', viewValue: 'Query Effectiveness' }, // Relación entre Coverage Effectiveness y Number of Queries. Esto permite medir la eficiencia asociada al proceso de búsqueda seguido por el usuario
    { value: 'Active-bookmarks', viewValue: 'Active Bookmarks' }, //Número total de documentos recuperados por el participante, incluidos los relevantes y no relevantes
    { value: 'Search-score', viewValue: 'Search Score' }, //Relación entre el número de documentos marcados que son relevantes y todos los marcados por el usuario. En una escala de 0 a 5, con una puntuación de 3,5 se aprueba al participante
    { value: 'Total-page-stay', viewValue: 'Total Page Stay' }, // Tiempo total en segundos que el participante permanece en documentos
    { value: 'Page-stay', viewValue: 'Page Stay' }, // Tiempo total en segundos que el participante estuvo en el último documento visitado
    { value: 'Query-entropy', viewValue: 'Query Entropy' }, // Mide la frecuencia de cada una de las palabras de la consulta de tal forma que aquellas que menos se repiten aportan más información
    { value: 'Writing-time-query', viewValue: 'Writing Time Query' }, //Tiempo total en segundos utilizado por el participante en el proceso de escritura de todas las consultas realizadas
    { value: 'Total-query-modification', viewValue: 'Total Query Modification' }, // Número de modificaciones realizadas a las consultas en el proceso de escritura en la etapa de búsqueda
    { value: 'If-quotes', viewValue: 'If Quotes' }, // Indica si la última consulta formulada posee comillas (1.0) o no (0.0)
    { value: 'First-query-time', viewValue: 'First Query Time' }, // Indica de forma progresiva (cada 1 segundo aproximadamente) cuanto tiempo (en segundos) lleva el estudiante sin hacer la primera consulta
  ];

}
