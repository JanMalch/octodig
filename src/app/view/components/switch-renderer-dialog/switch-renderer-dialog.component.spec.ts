import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchRendererDialogComponent } from './switch-renderer-dialog.component';

describe('SwitchRendererDialogComponent', () => {
  let component: SwitchRendererDialogComponent;
  let fixture: ComponentFixture<SwitchRendererDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SwitchRendererDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchRendererDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
