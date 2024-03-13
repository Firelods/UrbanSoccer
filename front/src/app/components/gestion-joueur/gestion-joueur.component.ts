import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-joueur',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule],
  templateUrl: './gestion-joueur.component.html',
  styleUrl: './gestion-joueur.component.scss',
})
export class GestionJoueurComponent implements AfterViewInit {
  playersActivity: { name: string; matches_count: number }[] = [];
  dataSource = new MatTableDataSource(this.playersActivity);
  displayedColumns: string[] = ['playersname', 'matches_count'];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    this.apiService.getPlayersActivity().subscribe((data) => {
      this.playersActivity = data;
      this.dataSource = new MatTableDataSource(this.playersActivity);
      this.dataSource.sort = this.sort;
    });
    console.log(this.sort);
  }
}
