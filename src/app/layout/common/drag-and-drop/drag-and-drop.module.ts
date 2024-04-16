import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { DragAndDropComponent } from './drag-and-drop.component';
import { DragAndDropDirective } from './drag-and-drop.directive';

@NgModule({
  declarations: [
    DragAndDropDirective,
    DragAndDropComponent
  ],
  imports: [
    RouterModule.forChild([]),
    SharedModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  exports: [
    DragAndDropDirective,
    DragAndDropComponent
  ]
})
export class DragAndDropModule {
}
