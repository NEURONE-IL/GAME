import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChangeDetectorRef } from '@angular/core';
import { originalSingle } from './data'
import * as XLSX from 'xlsx';
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

  selectedMetric: string;
  chartsVisible = false;
  originalSingle: any = [
  ];

  barChartOptions: any = {
    single: [...this.originalSingle],
    view: [450, 330],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    }
  };

  circularChartOptions: any = {
    single: [...this.originalSingle],
    view: [450, 350],
    gradient: true,
    showLegend: true,
    showLabels: true,
    isDoughnut: false,
    legendPosition: 'right',
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    }
  };

  linearChartOptions: any = {
    single: [...this.originalSingle],
    view: [900, 350],
    legend: true,
    showLabels: true,
    animations: true,
    xAxis: true,
    yAxis: true,
    showYAxisLabel: false,
    showXAxisLabel: false,
    xAxisLabel: 'Year',
    yAxisLabel: 'Population',
    timeline: true,

    colorScheme: {
      domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    }
  }
  study$: any; // Variable para almacenar el estudio obtenido del servicio
  idStudy: string; // Variable para almacenar el id del estudio
  students: Student[] = [];
  selectedStudent = 'todos';
  constructor(private authService: AuthService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {
    Object.assign(this, { originalSingle });
  }

  ngOnInit(): void {
    this.idStudy = this.route.snapshot.paramMap.get('study_id'); // Obtiene el id del estudio de la ruta
    console.log(this.idStudy)
    this.getStudyData(this.idStudy); // Llama al servicio con el id del estudio
    console.log(this.study$)
  }

  getStudyData(id: string): void {
    this.authService.getUsersByStudy(id).subscribe(
      (studyData: any) => {
        this.study$ = studyData;
        // procesar los datos del estudio para obtener los estudiantes
        this.students = studyData.users.map(user => {
          return {
            value: user._id,
            viewValue: user.names,
          };
        });

        // Agregar la opción "Todos" al inicio de la lista de estudiantes
        this.students.unshift({ value: 'todos', viewValue: 'Todos' });
        console.log(this.students)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onStudentChange(value: string): void {
    this.selectedStudent = value;
    this.updateChartData();
    this.cdRef.detectChanges();
  }


  onMetricChange(value: string): void {
    this.selectedMetric = value;
    this.updateChartData();
    this.cdRef.detectChanges();
  }

  updateChartData(): void {
    let filteredData;
    if (this.selectedMetric === 'Todos') {
      filteredData = [...this.originalSingle];  // Muestra todos los datos si se selecciona 'Todos'
    } else {
      filteredData = this.originalSingle.filter(data => data.type === this.selectedMetric);
    }
  
    if (this.selectedStudent !== 'todos') {
      filteredData = filteredData.filter(data => data.userId === this.selectedStudent);
    }
  
    // Group by 'userId'
    let groupedData = filteredData.reduce((groups, data) => {
      let group = groups[data.userId] || [];
      group.push(data);
      groups[data.userId] = group;
      return groups;
    }, {});
  
    // Map the grouped data to the structure that ngx-charts expects
    let barAndCircularChartData = [];
    let linearChartData = [];
    for (let userId in groupedData) {
      let userName = this.students.find(student => student.value === userId)?.viewValue || userId;
  
      // For bar and circular charts, we can still use the maximum 'value'
      let maxValue = Math.max(...groupedData[userId].map(data => data.value));
      barAndCircularChartData.push({
        name: userName,
        value: maxValue
      });
  
      // For the linear chart, we create a series with each data point
      linearChartData.push({
        name: userName,
        series: groupedData[userId].map((data, index) => ({
          name: index.toString(),  // Using the index as the 'name' for each data point
          value: data.value
        }))
      });
    }
  
    this.barChartOptions.single = barAndCircularChartData;
    this.circularChartOptions.single = barAndCircularChartData;
    this.linearChartOptions.single = linearChartData;
    
    this.chartsVisible = this.barChartOptions.single.length > 0;
    console.log(this.chartsVisible)
    console.log(this.barChartOptions.single)
    console.log(this.circularChartOptions.single)
    console.log(this.linearChartOptions.single)
    this.cdRef.markForCheck();
  }  


  selectedValue: string;
  selectedCar: string;

  metrics: Metric[] = [
    { value: 'totalcover', viewValue: 'Totalcover' }, //NNúmero total de documentos diferentes visitados por el participante
    { value: 'bmrelevant', viewValue: 'Bmrelevant' }, //Número de documentos relevantes recuperados por el participante
    { value: 'precision', viewValue: 'Precision' }, // Relación entre el número de documentos relevantes encontrados y el universo total de documentos diferentes visitados
    { value: 'totalpagestay', viewValue: 'Total Page Stay' }, // Tiempo total en segundos que el participante permanece en documentos
    { value: 'pagestay', viewValue: 'Page Stay' }, // Tiempo total en segundos que el participante estuvo en el último documento visitado
    { value: 'writingtime', viewValue: 'Writing Time Query' }, //Tiempo total en segundos utilizado por el participante en el proceso de escritura de todas las consultas realizadas
    { value: 'ifquotes', viewValue: 'If Quotes' }, // Indica si la última consulta formulada posee comillas (1.0) o no (0.0)
    { value: 'firstquerytime', viewValue: 'First Query Time' }, // Indica de forma progresiva (cada 1 segundo aproximadamente) cuanto tiempo (en segundos) lleva el estudiante sin hacer la primera consulta
    { value: 'challengestarted', viewValue: 'Challenge Started' },
  ];


  downloadExcel(): void {
    /* Genera un objeto de libro de trabajo */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    /* Genera una hoja de trabajo */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.originalSingle);

    /* Agrega la hoja de trabajo al libro de trabajo */
    XLSX.utils.book_append_sheet(wb, ws, 'Métricas');

    /* Guarda el archivo */
    XLSX.writeFile(wb, 'metricas.xlsx');
  }
}
