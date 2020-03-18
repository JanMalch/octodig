import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RateState } from '../../../github/rate/models';

@Component({
  selector: 'app-rate-limit-reached',
  templateUrl: './rate-limit-reached.component.html',
  styleUrls: ['./rate-limit-reached.component.scss']
})
export class RateLimitReachedComponent implements OnInit {
  isLoggedIn = false;

  constructor(@Inject(MAT_DIALOG_DATA) public readonly rate: RateState) {}

  ngOnInit() {}
}
