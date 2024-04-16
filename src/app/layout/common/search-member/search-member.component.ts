import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations/public-api';
import { BackendUserSearch, UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'search-member',
  templateUrl: './search-member.component.html',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuseSearch',
  animations: fuseAnimations
})
export class SearchMemberComponent implements OnChanges, OnInit, OnDestroy {

  @Input() showLabel: boolean = false;

  @Input() appearance: 'basic' | 'bar' = 'basic';

  @Input() debounce: number = 300;
  @Input() minLength: number = 2;

  @Input() type: 'ALL' | 'ON_DUTY' | 'OFF_DUTY' | 'OFFLINE' = 'ALL';

  @Input() isDisabled: boolean = false;

  @Output() search: EventEmitter<BackendUserSearch[]> = new EventEmitter();

  @Output() selected: EventEmitter<BackendUserSearch> = new EventEmitter();

  opened: boolean = false;

  resultSets: BackendUserSearch[];

  searchControl: FormControl = new FormControl();

  private users: BackendUserSearch[];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private interval: any;

  constructor(
    private _userService: UserService
  ) {

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
    this.loadUsers();

    this.interval = setInterval(() => {
      this.loadUsers();
    }, 1000 * 15);

    this.searchControl.valueChanges.pipe(debounceTime(this.debounce), takeUntil(this._unsubscribeAll), map((value) => {
      if (!(value) || (value.length < this.minLength))
        this.resultSets = null;
      return value;
    }), filter(value => value && value.length >= this.minLength)).subscribe((value) => {
      const results = this.users.filter((x) => x.userId.includes(value) || `${x.firstName} ${x.lastName}`.toLowerCase().includes(value.toLowerCase()));

      this.resultSets = results;
      this.search.next(results);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    clearInterval(this.interval);
  }

  private loadUsers() {
    this._userService.searchByType(this.type).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.users = response;
    });
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
    if (!(this.opened))
      return;
    this.searchControl.setValue('');
    this.opened = false;
  }

  select(search: BackendUserSearch) {
    this.selected.emit(search);
    this.searchControl.setValue(`${search.firstName} ${search.lastName} (ID: ${search.userId})`);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
