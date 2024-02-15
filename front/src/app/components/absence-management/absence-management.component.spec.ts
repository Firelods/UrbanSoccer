import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceManagementComponent } from './absence-management.component';

describe('AbsenceManagementComponent', () => {
  let component: AbsenceManagementComponent;
  let fixture: ComponentFixture<AbsenceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsenceManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbsenceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
