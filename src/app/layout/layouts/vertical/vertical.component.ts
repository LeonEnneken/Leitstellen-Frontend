import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { BackendControlCenterDetails, ControlCentersService } from 'app/core/services/control-centers.service';
import { DonationService, TransactionCurrentReponse } from 'app/core/services/donation.service';
import { BackendSettings, BackendSettingsHeaderDetails, SettingsService } from 'app/core/services/settings.service';
import { StatisticsService } from 'app/core/services/statistics.service';
import { BackendUser, UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MENU } from './menu';

@Component({
  selector: 'vertical-layout',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {

  isScreenSmall: boolean;

  items: FuseNavigationItem[] = [];

  user: BackendUser;

  counts: any;

  settings: BackendSettings;

  transactionsData: TransactionCurrentReponse;

  private details: BackendControlCenterDetails[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _controlCentersService: ControlCentersService,
    private _donationService: DonationService,
    private _settingsService: SettingsService,
    private _statisticsService: StatisticsService,
    private userService: UserService,


    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService) {

  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  ngOnInit(): void {
    this.items = MENU;

    this._controlCentersService.details.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.details = response;
    });

    this._donationService.getCurrent().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.transactionsData = response;
    });

    this._settingsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.settings = response;
    });

    this._settingsService.getSettings().pipe(takeUntil(this._unsubscribeAll)).subscribe();

    this._statisticsService.getCounts.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.counts = response;
    });

    /*
    if (this.hasPermissions('STATISTICS_SHOW'))
      this.statisticsService.counts.subscribe((counts) => this.counts = counts);*/

    this.userService.user$.pipe((takeUntil(this._unsubscribeAll))).subscribe((user) => {
      this.user = user;
    });

    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      this.isScreenSmall = !matchingAliases.includes('md');
    });
  }

  getCurrentAmount() {
    if(!(this.transactionsData)) {
      return '0.00';
    }
    return Math.round(this.transactionsData.amounts.current / 100).toFixed(2);
  }

  getMaxAmount() {
    if(!(this.transactionsData)) {
      return '100.00';
    }
    return Math.round(this.transactionsData.amounts.max / 100).toFixed(2);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  hasPermissions(permissions: string) {
    return this.userService.hasPermissions(permissions);
  }

  toggleNavigation(name: string): void {
    const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      navigation.toggle();
    }
  }

  updateUserStatus(status: 'ON_DUTY' | 'AWAY_FROM_KEYBOARD' | 'OFF_DUTY' | 'OFFLINE') {
    this.userService.updateStatus(status);
  }

  getCount(item: BackendSettingsHeaderDetails) {
    const details = this.details.filter((x) => x.type === item.value);

    if(!(details)) {
      return 0;
    }
    let count = 0;

    details.map((x) => count += x.members.length);

    return count;
  }

  getHeaderClasses(item: BackendSettingsHeaderDetails) {
    const response: any = {};

    response[`bg-${item.color.toLowerCase()}-200`] = true;
    response[`text-${item.color.toLowerCase()}-800`] = true;
    response[`dark:bg-${item.color.toLowerCase()}-600`] = true;
    response[`dark:text-${item.color.toLowerCase()}-50`] = true;

    return response;
  }
}
