import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateLimitReachedComponent } from './rate-limit-reached.component';

describe('RateLimitReachedComponent', () => {
  let component: RateLimitReachedComponent;
  let fixture: ComponentFixture<RateLimitReachedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RateLimitReachedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateLimitReachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
