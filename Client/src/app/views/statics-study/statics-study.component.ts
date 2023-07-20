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
      domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    }
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
      barAndCircularChartData.push({
        name: userName,
        value: maxValue
      });

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
    this.linearChartOptions.single = linearChartData;

    this.chartsVisible = this.barChartOptions.single.length > 0;
    this.cdRef.markForCheck();
  }

  downloadExcel(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.originalSingle);
    XLSX.utils.book_append_sheet(wb, ws, 'Métricas');
    XLSX.writeFile(wb, 'metricas.xlsx');
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

    for (let i = 0; i < this.metrics.length; i++) {
      const metric = this.metrics[i];

      this.onMetricChange(metric.value);
      await this.cdRef.detectChanges();

      const data = document.getElementById('pdf-border');

      if (data) {
        const canvas = await html2canvas(data);
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const imgData = canvas.toDataURL('image/png');

        if (i > 0) {
          mergedPdf.addPage();
        }

        mergedPdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
    }

    Swal.close();
    mergedPdf.save('metricas.pdf');
  }

  getSelectedStudentName(): string {
    if (this.selectedStudent === 'todos') {
      return 'Todos';
    }
    const selectedStudent = this.students.find(student => student.value === this.selectedStudent);
    return selectedStudent ? selectedStudent.viewValue : '';
  }
  
}
