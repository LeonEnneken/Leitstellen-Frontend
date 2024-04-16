import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { fuseAnimations } from '@fuse/animations';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { BackendGroup, GroupsService } from 'app/core/services/groups.service';
import { Equipment } from 'app/shared/shared.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'information-ranks',
  templateUrl: './ranks.component.html',
  styleUrls: ['./ranks.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InformationRanksComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: MatDrawer;

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;

  panels: any[] = [];
  selectedPanel: string;

  groups: BackendGroup[];

  selectedGroup?: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _groupsService: GroupsService,

    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService) {

  }

  ngOnInit(): void {
    this.panels = [{
      id: 'information',
      icon: 'heroicons_outline:user-circle',
      title: 'Informationen',
      description: 'Informationen zu dem ausgewählen Rang.'
    }, {
      id: 'equipment',
      icon: 'heroicons_outline:user-circle',
      title: 'Normale Ausstattung',
      description: 'Die normale Ausstattung zum ausgewählen Rang.'
    }, {
      id: 'equipment-event',
      icon: 'heroicons_outline:user-circle',
      title: 'Event Ausstattung',
      description: 'Die Event Ausstattung zum ausgewählen Rang.'
    }];

    this.selectedPanel = this.panels[0].id;

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

    this._groupsService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groups = response
        .filter((x) => x.showInOverview && x.data && Object.keys(x.data).length !== 0)
        .sort((a, b) => a.uniqueId - b.uniqueId);

      if (this.groups.length >= 1) {
        this.selectedGroup = this.groups[0].id;
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  goToPanel(panel: string): void {
    this.selectedPanel = panel;

    if (this.drawerMode === 'over') {
      this.drawer.close();
    }
  }

  getPanelInfo(id: string): any {
    return this.panels.find(panel => panel.id === id);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  getGroup() {
    if (!(this.selectedGroup)) {
      return undefined;
    }
    return this.groups.find((x) => x.id === this.selectedGroup);
  }

  getEquip(): Equipment[] {
    const group = this.getGroup();

    if (!(group) || !(group.data) || !(group.data['equipments'])) {
      return [];
    }
    return group.data['equipments'].filter((x) => x.amount !== 0);
  }

  getEquipEvent(): Equipment[] {
    const group = this.getGroup();

    if (!(group) || !(group.data) || !(group.data['equipmentsEvent'])) {
      return [];
    }
    return group.data['equipmentsEvent'].filter((x) => x.amount !== 0);
  }

  getDetails(text: string) {
    if(!(text)) {
      return '';
    }
    return text.replace(/\n/g, '<br/>');
  }

}
