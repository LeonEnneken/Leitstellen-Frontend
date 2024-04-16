import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from 'app/core/services/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'maintenance',
  templateUrl: './maintenance.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _settingsService: SettingsService, private _router: Router) {
  }

  ngOnInit(): void {
    this._settingsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      if(!(response.maintenance)) {
        this._router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
