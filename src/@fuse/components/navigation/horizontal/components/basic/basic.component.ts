import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { FuseHorizontalNavigationComponent } from '@fuse/components/navigation/horizontal/horizontal.component';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fuse-horizontal-navigation-basic-item',
  templateUrl: './basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseHorizontalNavigationBasicItemComponent implements OnInit, OnDestroy {

  @Input() item: FuseNavigationItem;
  @Input() name: string;

  isActiveMatchOptions: IsActiveMatchOptions;
  private _fuseHorizontalNavigationComponent: FuseHorizontalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseNavigationService: FuseNavigationService,
    private _fuseUtilsService: FuseUtilsService
  ) {
    this.isActiveMatchOptions = this._fuseUtilsService.subsetMatchOptions;
  }

  ngOnInit(): void {
    this.isActiveMatchOptions =
      this.item.isActiveMatchOptions ?? this.item.exactMatch
        ? this._fuseUtilsService.exactMatchOptions
        : this._fuseUtilsService.subsetMatchOptions;

    this._fuseHorizontalNavigationComponent = this._fuseNavigationService.getComponent(this.name);

    this._changeDetectorRef.markForCheck();

    this._fuseHorizontalNavigationComponent.onRefreshed.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
