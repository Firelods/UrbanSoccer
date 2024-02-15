import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.scss',
})
export class TeamOverviewComponent {
  team = [
    { position: 'Goalkeeper', name: 'Loic' },
    { position: 'Defender', name: 'Payet' },
    // ... other positions
  ];

  constructor(private apiService: ApiService) {
    this.fetchTeamData();
  }

  fetchTeamData() {
    this.apiService.getTeam().subscribe(
      (data) => {
        this.team = data;
      },
      (error) => {
        // Handle error scenario
      }
    );
  }
}
