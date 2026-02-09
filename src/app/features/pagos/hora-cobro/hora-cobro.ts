import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';

import { Toolbar } from '../../../shared/toolbar/toolbar';
import { PagosDia } from '../pagos-dia/pagos-dia';
import { PagosHora } from '../pagos-hora/pagos-hora';

@Component({
  selector: 'app-hora-cobro',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    Toolbar,
    PagosDia,
    PagosHora,
  ],
  templateUrl: './hora-cobro.html',
  styleUrl: './hora-cobro.scss',
})
export class HoraCobro {

}
