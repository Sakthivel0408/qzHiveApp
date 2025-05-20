import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuizDetailsComponent } from './admin-quiz-details.component';

describe('AdminQuizDetailsComponent', () => {
  let component: AdminQuizDetailsComponent;
  let fixture: ComponentFixture<AdminQuizDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminQuizDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQuizDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
