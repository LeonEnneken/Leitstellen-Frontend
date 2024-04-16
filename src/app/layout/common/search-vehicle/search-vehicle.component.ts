import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations/public-api';
import { BackendVehicle, VehiclesService } from 'app/core/services/vehicles.service';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'search-vehicle',
  templateUrl: './search-vehicle.component.html',
  styleUrls: ['./search-vehicle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuseSearch',
  animations: fuseAnimations
})
export class SearchVehicleComponent implements OnChanges, OnInit, OnDestroy {

  @Input() debounce: number = 300;
  @Input() minLength: number = 2;

  @Output() search: EventEmitter<BackendVehicle[]> = new EventEmitter();

  @Output() selected: EventEmitter<BackendVehicle> = new EventEmitter();

  opened: boolean = false;

  resultSets: BackendVehicle[];

  searchControl: FormControl = new FormControl();

  private vehicles: BackendVehicle[];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _vehiclesService: VehiclesService
  ) {

  }

  @HostBinding('class') get classList(): any {
    return {
      'search-appearance-basic': true,
      'w-full': true,
      'search-opened': this.opened
    };
  }

  @ViewChild('barSearchInput')
  set barSearchInput(value: ElementRef) {
    if (value) {
      setTimeout(() => {
        value.nativeElement.focus();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('appearance' in changes) {
      this.close();
    }
  }

  ngOnInit(): void {
    this._vehiclesService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.vehicles = response;
    });

    this.searchControl.valueChanges.pipe(debounceTime(this.debounce), takeUntil(this._unsubscribeAll), map((value) => {
      if (!(value) || (value.length < this.minLength))
        this.resultSets = null;
      return value;
    }), filter(value => value && value.length >= this.minLength)).subscribe((value) => {
      const results = this.vehicles.filter((x) => x.licensePlate.toLowerCase().includes(value.toLowerCase()) || x.name.toLowerCase().includes(value.toLowerCase()));

      this.resultSets = results;
      this.search.next(results);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  open(): void {
    if (this.opened)
      return;
    this.opened = true;
  }

  close(): void {
    if (!this.opened)
      return;
    this.searchControl.setValue('');
    this.opened = false;
  }

  select(search: any) {
    this.selected.emit(search);
    this.searchControl.setValue(`${search.name} (Kennzeichen: ${search.licensePlate})`);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
