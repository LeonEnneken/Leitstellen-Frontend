import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'fuse-masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  exportAs: 'fuseMasonry'
})
export class FuseMasonryComponent implements OnChanges, AfterViewInit {

  @Input() columnsTemplate: TemplateRef<any>;
  @Input() columns: number;
  @Input() items: any[] = [];
  distributedColumns: any[] = [];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('columns' in changes) {
      this._distributeItems();
    }

    if ('items' in changes) {
      this._distributeItems();
    }
  }

  ngAfterViewInit(): void {
    this._distributeItems();
  }

  private _distributeItems(): void {
    if (this.items.length === 0) {
      this.distributedColumns = [];
      return;
    }
    this.distributedColumns = Array.from(Array(this.columns), item => ({ items: [] }));

    for (let i = 0; i < this.items.length; i++) {
      this.distributedColumns[i % this.columns].items.push(this.items[i]);
    }
  }
}
