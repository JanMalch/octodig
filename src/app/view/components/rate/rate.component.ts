import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RateState } from '../../../github/rate/models';
import { RateService } from '../../../github/rate/rate.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateComponent implements OnInit {
  rate$: Observable<RateState>;

  constructor(private rateService: RateService) {
    this.rate$ = this.rateService.rate$;
  }

  ngOnInit() {}

  onMouseEnter() {
    this.rateService.refresh();
  }
}
