import { Routes } from '@angular/router';
import { SplashScreenComponent } from './splash/splash-screen.component';
import { PersonComponent } from './people/person.component';
import { PersonDetailComponent } from './people/person-detail.component';

export const routes: Routes = [
  // First screen the app shows after the native launch screen.
  { path: 'splash', component: SplashScreenComponent },
  { path: '', redirectTo: '/splash', pathMatch: 'full' },
  { path: 'items', component: PersonComponent },
  { path: 'item/:id', component: PersonDetailComponent },
];
