import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations/public-api';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuseSearch',
  animations: fuseAnimations
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {

  @Input() appearance: 'basic' | 'bar' = 'basic';
  @Input() debounce: number = 300;
  @Input() minLength: number = 2;
  @Output() search: EventEmitter<any> = new EventEmitter<any>();

  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  opened: boolean = false;
  resultSets: any[];
  searchControl: FormControl = new FormControl();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {

  }

  @HostBinding('class') get classList(): any {
    return {
      'search-appearance-bar': this.appearance === 'bar',
      'search-appearance-basic': this.appearance === 'basic',
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
    this.searchControl.valueChanges.pipe(debounceTime(this.debounce), takeUntil(this._unsubscribeAll), map((value) => {
      if (!value || value.length < this.minLength) {
        this.resultSets = null;
      }
      return value;
    }), filter(value => value && value.length >= this.minLength)).subscribe((value) => {
      /*this.backendService.searchUsers(value).subscribe((result) => {
        this.resultSets = result;
        this.search.next(result);
      });*/
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.appearance === 'bar' && event.code === 'Escape')
      this.close();
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

  select(searchUser: any) {
    this.selected.emit(searchUser);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
