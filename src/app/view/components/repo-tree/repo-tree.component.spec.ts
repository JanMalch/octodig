import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoTreeComponent } from './repo-tree.component';

describe('RepoTreeComponent', () => {
  let component: RepoTreeComponent;
  let fixture: ComponentFixture<RepoTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepoTreeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
