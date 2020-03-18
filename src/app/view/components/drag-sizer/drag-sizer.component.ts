import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drag-sizer',
  template: '',
  styleUrls: ['./drag-sizer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragSizerComponent {
  @Input() xOffset = 0;
  @Input() yOffset = 0;
  @Output() xPos = new EventEmitter<number>();
  @Output() yPos = new EventEmitter<number>();

  private dragging = false;

  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
  }

  @HostListener('mousedown')
  onMouseDown() {
    this.dragging = true;
    return false; // Call preventDefault() on the event
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging) {
      this.xPos.emit(Math.min(Math.max(8, event.clientX - this.xOffset), window.innerWidth * 0.9));
      this.yPos.emit(Math.min(Math.max(8, event.clientY - this.yOffset), window.innerHeight * 0.9));
    }
  }
}
