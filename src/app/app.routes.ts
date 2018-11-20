import {RouterModule, Routes} from '@angular/router';
import {IngresoComponent} from './ingreso/ingreso.component';
import {HomeComponent} from './home/home.component';
import { AdminComponent } from './admin/admin.component';

// arreglo de rutas
const APP_ROUTES: Routes =[
    { path: 'ingreso', component: IngresoComponent},
    { path: 'home', component: HomeComponent},
    { path: 'admin', component: AdminComponent},
    { path: '**',pathMatch: 'full', redirectTo:'ingreso' }
];

export const APP_ROUTING= RouterModule.forRoot(APP_ROUTES);
