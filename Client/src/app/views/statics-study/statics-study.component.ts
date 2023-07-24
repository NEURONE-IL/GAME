import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

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
  originalSingle: any = [];

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
      domain: [
        '#5AA454', '#E44D25', '#CFC0BB', '#7AA3E5', '#A8385D', '#AAE3F5',
        '#9B7653', '#67032F', '#B5E2FA', '#ACE5EE', '#00FF00', '#FF00FF',
        '#FFFF00', '#0000FF', '#800000', '#808000', '#008000', '#800080',
        '#008080', '#000080', '#FDB813', '#C04000', '#C08040', '#00C0C0',
        '#4000C0', '#C000C0', '#404080', '#80C0C0', '#8080C0', '#C0C080',
        '#3F3F3F', '#7F7F7F', '#BFBFBF', '#FFFFFF', '#FF4500', '#7FFF00',
        '#D2691E', '#8A2BE2', '#7FFF00', '#DAA520'
    ]
    }
  };

  numberCardOptions: any = {
    single: [...this.originalSingle],
    view: [900, 330],  // configura el tamaño según tus necesidades
    colorScheme: {
      domain: [
        '#5AA454', '#E44D25', '#CFC0BB', '#7AA3E5', '#A8385D', '#AAE3F5',
        '#9B7653', '#67032F', '#B5E2FA', '#ACE5EE', '#00FF00', '#FF00FF',
        '#FFFF00', '#0000FF', '#800000', '#808000', '#008000', '#800080',
        '#008080', '#000080', '#FDB813', '#C04000', '#C08040', '#00C0C0',
        '#4000C0', '#C000C0', '#404080', '#80C0C0', '#8080C0', '#C0C080',
        '#3F3F3F', '#7F7F7F', '#BFBFBF', '#FFFFFF', '#FF4500', '#7FFF00',
        '#D2691E', '#8A2BE2', '#7FFF00', '#DAA520'
    ]
    },
    cardColor: '#232837'
  };


  study$: any;
  idStudy: string;
  students: Student[] = [];
  selectedStudent = 'todos';

  allMetrics: Metric[] = [
    { value: 'totalcover', viewValue: 'Totalcover' },
    { value: 'bmrelevant', viewValue: 'Bmrelevant' },
    { value: 'precision', viewValue: 'Precision' },
    { value: 'totalpagestay', viewValue: 'Total Page Stay' },
    { value: 'pagestay', viewValue: 'Page Stay' },
    { value: 'writingtime', viewValue: 'Writing Time Query' },
    { value: 'ifquotes', viewValue: 'If Quotes' },
    { value: 'firstquerytime', viewValue: 'First Query Time' },
    { value: 'challengestarted', viewValue: 'Challenge Started' },
  ];
  metrics: any;

  constructor(private authService: AuthService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.idStudy = this.route.snapshot.paramMap.get('study_id');
    this.getStudyData(this.idStudy);
    this.getMetricsData(this.idStudy);
  }

  getStudyData(id: string): void {
    this.authService.getUsersByStudy(id).subscribe(
      (studyData: any) => {
        this.study$ = studyData;
        this.students = studyData.users.map(user => {
          return {
            value: user._id,
            viewValue: user.names,
          };
        });
        this.students.unshift({ value: 'todos', viewValue: 'Todos' });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getMetricsData(id: string): void {
    this.authService.getMetricsByStudy(id).subscribe(
      (studyData: any) => {
        this.originalSingle = studyData.map(metricData => {
          return {
            userId: metricData.userId,
            value: metricData.value,
            type: metricData.type
          };
        });

        this.updateMetrics();

        this.updateChartData();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateMetrics(): void {
    if (this.selectedStudent === 'todos') {
      this.metrics = this.allMetrics.filter(metric =>
        this.originalSingle.some(data => data.type === metric.value && data.value)
      );
    } else {
      this.metrics = this.allMetrics.filter(metric =>
        this.originalSingle.some(data => data.type === metric.value && data.value && data.userId === this.selectedStudent)
      );
    }
  }

  onStudentChange(value: string): void {
    this.selectedStudent = value;
    this.updateMetrics();
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
      filteredData = [...this.originalSingle];
    } else {
      filteredData = this.originalSingle.filter(data => data.type === this.selectedMetric);
    }

    if (this.selectedStudent !== 'todos') {
      filteredData = filteredData.filter(data => data.userId === this.selectedStudent);
    }

    let groupedData = filteredData.reduce((groups, data) => {
      let group = groups[data.userId] || [];
      group.push(data);
      groups[data.userId] = group;
      return groups;
    }, {});

    let barAndCircularChartData = [];
    let linearChartData = [];
    
    for (let userId in groupedData) {
      let userName = this.students.find(student => student.value === userId)?.viewValue || userId;

      let maxValue = Math.max(...groupedData[userId].map(data => data.value));
      
      let chartDataItem = {
        name: userName,
        value: maxValue
      };

      // Add extra field if the selectedMetric is 'challengestarted'
      if (this.selectedMetric === 'challengestarted') {
        chartDataItem.name = `${userName} ha iniciado reto`;
      }

      barAndCircularChartData.push(chartDataItem);

      linearChartData.push({
        name: userName,
        series: groupedData[userId].map((data, index) => ({
          name: index.toString(),
          value: data.value
        }))
      });
    }

    this.barChartOptions.single = barAndCircularChartData;
    this.circularChartOptions.single = barAndCircularChartData;
    this.numberCardOptions.single = barAndCircularChartData;
    this.linearChartOptions.single = linearChartData;

    this.chartsVisible = this.barChartOptions.single.length > 0;
    this.cdRef.markForCheck();
  }


  downloadExcel(): void {
  const studentsData: Record<string, Record<string, number>> = {};

  for (const metric of this.metrics) {
    const metricData = this.originalSingle.filter(data => data.type === metric.value);
    for (const data of metricData) {
      if (!studentsData[data.userId]) {
        studentsData[data.userId] = {};
      }
      if (!studentsData[data.userId][metric.value] || data.value > studentsData[data.userId][metric.value]) {
        studentsData[data.userId][metric.value] = data.value;
      }
    }
  }

  const worksheetData: any[] = [];
  const headerRow: any[] = ['Estudiante', ...this.metrics.map(metric => metric.viewValue)];

  worksheetData.push(headerRow);

  for (const studentId in studentsData) {
    const studentRow: any[] = [this.getStudentNameById(studentId)];
    for (const metric of this.metrics) {
      const value = studentsData[studentId][metric.value] || '';
      studentRow.push(value);
    }
    worksheetData.push(studentRow);
  }

  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Ajustar el ancho de las columnas
  const columnWidths: number[] = [20]; // Ancho de la primera columna (Estudiante)
  for (let i = 0; i < this.metrics.length; i++) {
    columnWidths.push(15); // Ancho de las columnas de métricas
  }
  worksheet['!cols'] = columnWidths.map(width => ({ width }));

  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Métricas');
  XLSX.writeFile(workbook, 'metricas.xlsx');
}
  
  getStudentNameById(userId: string): string {
    if (userId === 'todos') {
      return 'Todos';
    }
    const student = this.students.find(student => student.value === userId);
    return student ? student.viewValue : '';
  } 

  async downloadPDF(): Promise<void> {
    Swal.fire({
      title: 'Generando PDF',
      text: 'Por favor, espera...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    const mergedPdf = new jsPDF();
  
    const metricDescriptions = {
      totalcover: 'Número total de documentos diferentes visitados por el participante',
      bmrelevant: 'Número de documentos relevantes recuperados por el participante',
      precision: 'Relación entre el número de documentos relevantes encontrados y el universo total de documentos diferentes visitados',
      recall: 'Relación entre el número de documentos relevantes encontrados y el universo total de documentos relevantes',
      f1: 'Media armónica entre las métricas Precision y Recall',
      usfcover: 'Número de documentos diferentes visitados durante un período superior a un cierto número de segundos, por defecto treinta',
      numqueries: 'Número de consultas realizadas por cada participante',
      ceffectiveness: 'Relación entre el número de documentos visitados en un tiempo superior a treinta segundos y el universo total de documentos visitados',
      qeffectiveness: 'Relación entre Coverage Effectiveness y Number of Queries. Esto permite medir la eficiencia asociada al proceso de búsqueda seguido por el usuario',
      activebm: 'Número total de documentos recuperados por el participante, incluidos los relevantes y no relevantes',
      score: 'Relación entre el número de documentos marcados que son relevantes y todos los marcados por el usuario. En una escala de 0 a 5, con una puntuación de 3,5 se aprueba al participante',
      totalpagestay: 'Tiempo total en segundos que el participante permanece en documentos',
      pagestay: 'Tiempo total en segundos que el participante estuvo en el último documento visitado',
      entropy: 'Mide la frecuencia de cada una de las palabras de la consulta de tal forma que aquellas que menos se repiten aportan más información',
      writingtime: 'Tiempo total en segundos utilizado por el participante en el proceso de escritura de todas las consultas realizadas',
      modquery: 'Número de modificaciones realizadas a las consultas en el proceso de escritura en la etapa de búsqueda',
      ifquotes: 'Indica si la última consulta formulada posee comillas (1.0) o no (0.0)',
      firstquerytime: 'Indica de forma progresiva (cada 1 segundo aproximadamente) cuanto tiempo (en segundos) lleva el estudiante sin hacer la primera consulta',
      challengestarted: 'Indica si el participante ha iniciado el reto'
    };
  
    for (let i = 0; i < this.metrics.length; i++) {
      const metric = this.metrics[i];
  
      this.onMetricChange(metric.value);
      await this.cdRef.detectChanges();
  
      const data = document.getElementById('pdf-border');
  
      if (data) {
        if (i !== 0) { // Agrega una nueva página solo si no es la primera métrica
          mergedPdf.addPage();
        }
  
        // Agregar título "Reporte Estudio" en cada página
        mergedPdf.setFontSize(24);
        mergedPdf.text('Reporte Estudio', mergedPdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
        await this.delay(1000); // Agrega un retraso de 1 segundo (puedes ajustar el tiempo según tus necesidades)
  
        const canvas = await html2canvas(data);
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const imgData = canvas.toDataURL('image/png');
  
        // Agregar nombre de la métrica como texto al principio de la página
        mergedPdf.setFontSize(12);
        mergedPdf.text(metric.viewValue, 10, 60);
  
        // Agregar descripción de la métrica en español
        const description = metricDescriptions[metric.value];
        mergedPdf.setFontSize(10);
        const splitDescription = mergedPdf.splitTextToSize(description, 180);
        mergedPdf.text(splitDescription, 10, 70);
  
        // Agregar la imagen debajo del nombre y descripción de la métrica
        mergedPdf.addImage(imgData, 'PNG', 0, 90, imgWidth, imgHeight);
      }
    }
  
    Swal.close();
    mergedPdf.save('metricas.pdf');
  }
  
  

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  getSelectedStudentName(): string {
    if (this.selectedStudent === 'todos') {
      return 'Todos';
    }
    const selectedStudent = this.students.find(student => student.value === this.selectedStudent);
    return selectedStudent ? selectedStudent.viewValue : '';
  }

}
