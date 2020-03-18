import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OpenRedirectGuard } from './open-redirect.guard';
import { AboutComponent, HomePageComponent } from './pages';

const routes: Routes = [
  {
    path: 'v',
    loadChildren: () => import('./view/view.module').then(m => m.ViewModule)
  },
  {
    path: 'about',
    pathMatch: 'full',
    component: AboutComponent
  },
  {
    path: 'open',
    pathMatch: 'full',
    canActivate: [OpenRedirectGuard],
    component: HomePageComponent
  },
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule],
  providers: [OpenRedirectGuard]
})
export class AppRoutingModule {}
