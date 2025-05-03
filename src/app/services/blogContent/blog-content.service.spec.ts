import { TestBed } from '@angular/core/testing';

import { BlogContentService } from './blog-content.service';

describe('BlogContentService', () => {
  let service: BlogContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
