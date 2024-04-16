import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation/vertical/vertical.component';
import { BackendUser, UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fuse-vertical-navigation-collapsable-item',
  templateUrl: './collapsable.component.html',
  animations: fuseAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseVerticalNavigationCollapsableItemComponent implements OnInit, OnDestroy {

  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_autoCollapse: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() autoCollapse: boolean;
  @Input() item: FuseNavigationItem;
  @Input() name: string;

  isCollapsed: boolean = true;
  isExpanded: boolean = false;
  private _fuseVerticalNavigationComponent: FuseVerticalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private user: BackendUser;

  constructor(
    private userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _fuseNavigationService: FuseNavigationService
  ) {
  }

  @HostBinding('class') get classList(): any {
    return {
      'fuse-vertical-navigation-item-collapsed': this.isCollapsed,
      'fuse-vertical-navigation-item-expanded': this.isExpanded
    };
  }

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => this.user = user);

    this._fuseVerticalNavigationComponent = this._fuseNavigationService.getComponent(this.name);

    if (this._hasActiveChild(this.item, this._router.url)) {
      this.expand();
    } else {
      if (this.autoCollapse) {
        this.collapse();
      }
    }

    this._fuseVerticalNavigationComponent.onCollapsableItemCollapsed.pipe(takeUntil(this._unsubscribeAll)).subscribe((collapsedItem) => {
      if (collapsedItem === null) {
        return;
      }

      if (this._isChildrenOf(collapsedItem, this.item)) {
        this.collapse();
      }
    });

    if (this.autoCollapse) {
      this._fuseVerticalNavigationComponent.onCollapsableItemExpanded.pipe(takeUntil(this._unsubscribeAll)).subscribe((expandedItem) => {
        if (expandedItem === null) {
          return;
        }

        if (this._isChildrenOf(this.item, expandedItem)) {
          return;
        }

        if (this._hasActiveChild(this.item, this._router.url)) {
          return;
        }

        if (this.item === expandedItem) {
          return;
        }
        this.collapse();
      });
    }

    this._router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntil(this._unsubscribeAll)).subscribe((event: NavigationEnd) => {
      if (this._hasActiveChild(this.item, event.urlAfterRedirects)) {
        this.expand();
        return;
      }
      if (this.autoCollapse) {
        this.collapse();
      }
    });

    this._fuseVerticalNavigationComponent.onRefreshed.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  collapse(): void {
    if (this.item.disabled) {
      return;
    }

    if (this.isCollapsed) {
      return;
    }

    this.isCollapsed = true;
    this.isExpanded = !this.isCollapsed;

    this._changeDetectorRef.markForCheck();

    this._fuseVerticalNavigationComponent.onCollapsableItemCollapsed.next(this.item);
  }

  expand(): void {
    if (this.item.disabled) {
      return;
    }

    if (!this.isCollapsed) {
      return;
    }

    this.isCollapsed = false;
    this.isExpanded = !this.isCollapsed;

    this._changeDetectorRef.markForCheck();

    this._fuseVerticalNavigationComponent.onCollapsableItemExpanded.next(this.item);
  }

  toggleCollapsable(): void {
    if (this.isCollapsed) {
      this.expand();
      return;
    }
    this.collapse();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private _hasActiveChild(item: FuseNavigationItem, currentUrl: string): boolean {
    const children = item.children;

    if (!children) {
      return false;
    }

    for (const child of children) {
      if (child.children) {
        if (this._hasActiveChild(child, currentUrl)) {
          return true;
        }
      }
      if (child.link && this._router.isActive(child.link, child.exactMatch || false)) {
        return true;
      }
    }
    return false;
  }

  private _isChildrenOf(parent: FuseNavigationItem, item: FuseNavigationItem): boolean {
    const children = parent.children;

    if (!children) {
      return false;
    }

    if (children.indexOf(item) > -1) {
      return true;
    }

    for (const child of children) {
      if (child.children) {
        if (this._isChildrenOf(child, item)) {
          return true;
        }
      }
    }

    return false;
  }



  canShow(item: FuseNavigationItem) {
    if (!(this.user))
      return false;

    if (item.permissions) {
      const permissions = this.user?.permissions ?? [];

      if (!(permissions))
        return false;
      if (permissions.includes('*'))
        return true;
      if (this.user.role === 'ADMINISTRATOR')
        return true;
      if (item.permissions.includes(' ')) {
        const permissionsArray = item.permissions.split(' ');

        let hasPermission = false;

        for (let permission of permissionsArray) {
          if (permissions.includes(permission)) {
            hasPermission = true;
            break;
          }
        }
        return hasPermission;
      }
      return permissions.includes(item.permissions);
    }
    return true;
  }
}
