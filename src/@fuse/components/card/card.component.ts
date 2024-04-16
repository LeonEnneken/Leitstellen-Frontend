import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, HostBinding, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseCardFace } from '@fuse/components/card/card.types';

@Component({
  selector: 'fuse-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  exportAs: 'fuseCard'
})
export class FuseCardComponent implements OnChanges {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_expanded: BooleanInput;
  static ngAcceptInputType_flippable: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() expanded: boolean = false;
  @Input() face: FuseCardFace = 'front';
  @Input() flippable: boolean = false;

  constructor() {
  }

  @HostBinding('class') get classList(): any {
    return {
      'fuse-card-expanded': this.expanded,
      'fuse-card-face-back': this.flippable && this.face === 'back',
      'fuse-card-face-front': this.flippable && this.face === 'front',
      'fuse-card-flippable': this.flippable
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('expanded' in changes) {
      this.expanded = coerceBooleanProperty(changes.expanded.currentValue);
    }

    if ('flippable' in changes) {
      this.flippable = coerceBooleanProperty(changes.flippable.currentValue);
    }
  }
}
