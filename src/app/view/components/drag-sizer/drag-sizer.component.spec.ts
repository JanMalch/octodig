import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragSizerComponent } from './drag-sizer.component';

describe('DragSizerComponent', () => {
  let component: DragSizerComponent;
  let fixture: ComponentFixture<DragSizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DragSizerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragSizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
