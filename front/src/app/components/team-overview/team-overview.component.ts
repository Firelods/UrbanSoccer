import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface TeamMember {
  position: string;
  name: string;
}

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.scss',
})
export class TeamOverviewComponent {
  team: TeamMember[] = [
    { position: 'Goalkeeper', name: 'Loic' },
    { position: 'Defender', name: 'Payet' },
    // ... other positions
  ];

  constructor(private apiService: ApiService) {
    this.fetchTeamData();
  }

  fetchTeamData() {
    this.apiService.getTeam().subscribe((response: any) => {
      this.team = response.teamMembers;
    });
  }
}
