import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RepoFormComponent } from './components/repo-form/repo-form.component';
import { AuthInterceptor } from './github/auth.interceptor';
import { RateInterceptor } from './github/rate/rate.interceptor';
import { RateService } from './github/rate/rate.service';
import { BASE_PATH } from './github/tokens';
import { MaterialModule } from './material/material.module';
import { NotFoundInterceptor } from './not-found-interceptor.service';
import { AboutComponent, HomePageComponent } from './pages';

declare var CodeMirror: any;

export const localeIdByBrowser = ((registeredLocales: Array<any[]>): string => {
  registeredLocales.forEach(registerLocaleData);
  const registeredLocaleKeys = registeredLocales.map(([key]) => key);
  const browserLang = (navigator && navigator.language) || 'en-US';
  const primaryLangCode = browserLang.substring(0, 2);
  const foundLang = registeredLocaleKeys.find(key => key === browserLang) || registeredLocaleKeys.find(key => key === primaryLangCode);
  return foundLang || 'en-US';
})([localeDe, localeFr, localeEs]);

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  const original = renderer.code.bind(renderer);
  renderer.code = (code, language, isEscaped) => {
    const { mode } = CodeMirror.findModeByName(language);
    return original(code, language, isEscaped).replace('<pre>', `<pre data-lang="${mode}" class="cm-s-darcula">`);
  };
  return {
    renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true
  };
}

@NgModule({
  declarations: [AppComponent, HomePageComponent, RepoFormComponent, AboutComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory
      }
    })
  ],
  providers: [
    RateService,
    { provide: LOCALE_ID, useValue: localeIdByBrowser },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RateInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NotFoundInterceptor, multi: true },
    { provide: BASE_PATH, useValue: 'https://api.github.com/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
