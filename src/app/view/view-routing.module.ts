import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialFileRedirectGuard } from './initial-file.redirect.guard';
import { FilePageComponent, ViewPageComponent } from './pages';
import { SetRepositoryGuard } from './set-repository.guard';

const routes: Routes = [
  {
    path: ':owner',
    pathMatch: 'full',
    redirectTo: '/'
  },
  {
    path: ':owner/:name',
    pathMatch: 'full',
    redirectTo: ':owner/:name/master'
  },
  {
    path: ':owner/:name/:branch',
    component: ViewPageComponent,
    canActivate: [SetRepositoryGuard],
    children: [
      {
        path: ':filePath',
        component: FilePageComponent
      },
      {
        path: '',
        component: FilePageComponent,
        canActivate: [InitialFileRedirectGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SetRepositoryGuard, InitialFileRedirectGuard]
})
export class ViewRoutingModule {}
