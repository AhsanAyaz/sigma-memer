import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'generator',
    pathMatch: 'full',
  },
  {
    path: 'generator',
    loadChildren: () =>
      import('./generator/generator.module').then((m) => m.GeneratorModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
