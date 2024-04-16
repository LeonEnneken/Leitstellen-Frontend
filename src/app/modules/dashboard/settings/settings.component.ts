import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'panel-settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild('drawer') drawer: MatDrawer;

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;

  panels: any[] = [];

  selectedPanel: string;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.panels = [{
      id: 'settings',
      icon: 'heroicons_outline:cog',
      title: 'Generelle Einstellungen',
      description: 'Alle generellen Einstellungen verwalten',
      permissions: 'SETTINGS_MANAGE'
    }, {
      id: 'navigation',
      icon: 'heroicons_outline:menu',
      title: 'Navigations-Einstellungen',
      description: 'Alle Navigations-Einstellungen verwalten',
      permissions: 'SETTINGS_MANAGE'
    }, {
      id: 'departments',
      icon: 'heroicons_outline:user-group',
      title: 'Abteilungen',
      description: 'Alle Abteilungen der Organisation verwalten',
      permissions: 'DEPARTMENTS_MANAGE'
    }, {
      id: 'vehicles',
      icon: 'heroicons_outline:key',
      title: 'Fahrzeuge',
      description: 'Hier kannst du die Fahrzeuge verwalten',
      permissions: 'VEHICLES_MANAGE'
    }, {
      id: 'radio-codes',
      icon: 'heroicons_outline:chat-alt-2',
      title: 'Funk Codes',
      description: 'Hier kannst du die Funk Codes verwalten',
      permissions: 'RADIO_CODES_MANAGE'
    }, {
      id: 'control-centers',
      icon: 'heroicons_outline:adjustments',
      title: 'Leitstellen Panels',
      description: 'Alle Panels der Leitstelle der Organisation verwalten',
      permissions: 'CONTROL_CENTERS_MANAGE'
    }, {
      id: 'control-center-status',
      icon: 'heroicons_outline:adjustments',
      title: 'Leitstellen Stati',
      description: 'Alle Stati der Leitstelle der Organisation verwalten',
      permissions: 'SETTINGS_MANAGE'
    }, {
      id: 'groups',
      icon: 'heroicons_outline:user-circle',
      title: 'Ränge',
      description: 'Alle Ränge der Organisation verwalten',
      permissions: 'GROUPS_MANAGE'
    }];

    this.selectedPanel = this.panels[0].id;
    //this.selectedPanel = this.panels.filter((x) => this._userService.hasPermissions(x.permissions))[0]?.id;

    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      if (matchingAliases.includes('lg')) {
        this.drawerMode = 'side';
        this.drawerOpened = true;
      } else {
        this.drawerMode = 'over';
        this.drawerOpened = false;
      }
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  hasPermissions(permission: string) {
    return this._userService.hasPermissions(permission);
  }

  goToPanel(panel: string): void {
    this.selectedPanel = panel;

    if (this.drawerMode === 'over')
      this.drawer.close();
  }

  getPanelInfo(id: string): any {
    return this.panels.find(panel => panel.id === id);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
