import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-column-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './column-filter.html',
  styleUrl: './column-filter.scss',
})
export class ColumnFilter {

  @Input() label = 'Filtro';
  @Input() value = '';
  @Input() tooltip?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  @ViewChild(MatMenu) menu?: MatMenu;

  onInput(val: string) {
    this.valueChange.emit(val);
  }

  onClear() {
    this.clear.emit();
  }

}
