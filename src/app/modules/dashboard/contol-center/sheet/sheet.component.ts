import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BackendControlCenter, ControlCentersService } from "app/core/services/control-centers.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'control-center-sheets',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ControlCenterSheetComponent implements OnInit {

  controlCenters: BackendControlCenter[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _controlCentersService: ControlCentersService
  ) {

  }

  ngOnInit(): void {
    this._controlCentersService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.controlCenters = response;
    });
  }
}