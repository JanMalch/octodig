import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { StateService } from '../../github/state.service';

@UntilDestroy()
@Component({
  selector: 'app-repo-form[isLoggedIn]',
  templateUrl: './repo-form.component.html',
  styleUrls: ['./repo-form.component.scss']
})
export class RepoFormComponent implements OnInit {
  @Input() isLoggedIn: boolean;
  repoForm: FormGroup;
  loading = false;

  constructor(fb: FormBuilder, private router: Router, private route: ActivatedRoute, private state: StateService) {
    this.repoForm = fb.group({
      owner: ['', Validators.required],
      name: ['', Validators.required],
      branch: ['master', Validators.required]
    });
  }

  ngOnInit() {
    this.repoForm.patchValue(this.route.snapshot.queryParams);
  }

  onSubmit() {
    if (this.repoForm.valid) {
      this.loading = true;
      const { value } = this.repoForm;
      this.router.navigateByUrl(`/v/${value.owner}/${value.name}/${encodeURIComponent(value.branch)}`);
    }
  }
}
