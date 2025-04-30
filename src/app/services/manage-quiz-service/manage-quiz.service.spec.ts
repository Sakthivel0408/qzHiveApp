import { TestBed } from '@angular/core/testing';

import { ManageQuizService } from './manage-quiz.service';

describe('ManageQuizService', () => {
  let service: ManageQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
