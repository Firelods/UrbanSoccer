import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionJoueurComponent } from './gestion-joueur.component';

describe('GestionJoueurComponent', () => {
  let component: GestionJoueurComponent;
  let fixture: ComponentFixture<GestionJoueurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionJoueurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionJoueurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
