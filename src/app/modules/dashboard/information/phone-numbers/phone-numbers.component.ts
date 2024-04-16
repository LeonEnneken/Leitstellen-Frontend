import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BackendMemberPhoneNumber, MembersService } from 'app/core/services/members.service';
import { of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'information-phone-numbers',
  templateUrl: './phone-numbers.component.html',
  styleUrls: ['./phone-numbers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InformationPhoneNumbersComponent implements OnInit, OnDestroy {

  members: BackendMemberPhoneNumber[] = [];

  searchInputControl: FormControl = new FormControl();

  searchValue: string = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private _membersService: MembersService) {

  }

  ngOnInit(): void {
    this._membersService.getPhoneNumbers().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.members = response;
    });

    this.searchInputControl.valueChanges.pipe(takeUntil(this._unsubscribeAll), debounceTime(300), switchMap((query) => {
      this.searchValue = query;
      return of(true);
    })).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getMembers() {
    if(!(this.searchValue))
      return this.members;
    if(this.searchValue.trim().length === 0)
      return this.members;
    return this.members.filter((x) => x.fullName.toLowerCase().includes(this.searchValue.toLowerCase()) || x.phoneNumber.replace(/-/g, '').includes(this.searchValue));
  }

}
