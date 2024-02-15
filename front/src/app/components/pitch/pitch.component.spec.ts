import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchComponent } from './pitch.component';

describe('PitchComponent', () => {
  let component: PitchComponent;
  let fixture: ComponentFixture<PitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
