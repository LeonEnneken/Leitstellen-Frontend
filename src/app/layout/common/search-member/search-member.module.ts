import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule, MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SearchMemberComponent } from './search-member.component';

@NgModule({
  declarations: [
    SearchMemberComponent
  ],
  imports: [
    RouterModule.forChild([]),
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    SharedModule
  ],
  exports: [
    SearchMemberComponent
  ],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: (overlay: Overlay) => (): BlockScrollStrategy => overlay.scrollStrategies.block(),
      deps: [Overlay]
    }
  ]
})
export class SearchMemberModule {
}
