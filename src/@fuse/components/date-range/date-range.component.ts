import { Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, OnDestroy, OnInit, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatCalendarCellCssClasses, MatMonthView } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import 'moment/locale/de';
import { Subject } from 'rxjs';

@Component({
  selector: 'fuse-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuseDateRange',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FuseDateRangeComponent),
      multi: true
    }
  ]
})
export class FuseDateRangeComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Output() readonly rangeChanged: EventEmitter<{ start: string; end: string }> = new EventEmitter<{ start: string; end: string }>();
  @ViewChild('matMonthView1') private _matMonthView1: MatMonthView<any>;
  @ViewChild('matMonthView2') private _matMonthView2: MatMonthView<any>;
  @ViewChild('pickerPanelOrigin', { read: ElementRef }) private _pickerPanelOrigin: ElementRef;
  @ViewChild('pickerPanel') private _pickerPanel: TemplateRef<any>;
  @HostBinding('class.fuse-date-range') private _defaultClassNames = true;

  activeDates: { month1: Moment | null; month2: Moment | null } = {
    month1: null,
    month2: null
  };
  setWhichDate: 'start' | 'end' = 'start';
  startTimeFormControl: FormControl;
  endTimeFormControl: FormControl;
  private _dateFormat: string;
  private _onChange: (value: any) => void;
  private _onTouched: (value: any) => void;
  private _programmaticChange!: boolean;
  private _range: { start: Moment | null; end: Moment | null } = {
    start: null,
    end: null
  };
  private _timeFormat: string;
  private _timeRange: boolean;
  private readonly _timeRegExp: RegExp = new RegExp('^(0[0-9]|1[0-9]|2[0-4]|[0-9]):([0-5][0-9])(A|(?:AM)|P|(?:PM))?$', 'i');
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef,
    private _overlay: Overlay,
    private _renderer2: Renderer2,
    private _viewContainerRef: ViewContainerRef
  ) {
    this._onChange = (): void => {
    };
    this._onTouched = (): void => {
    };
    this.dateFormat = 'DD/MM/YYYY';
    this.timeFormat = '24';

    this._init();
  }

  @Input()
  set dateFormat(value: string) {
    if (this._dateFormat === value) {
      return;
    }
    this._dateFormat = value;
  }

  get dateFormat(): string {
    return this._dateFormat;
  }

  @Input()
  set timeFormat(value: string) {
    if (this._timeFormat === value) {
      return;
    }
    this._timeFormat = value === '12' ? 'hh:mmA' : 'HH:mm';
  }

  get timeFormat(): string {
    return this._timeFormat;
  }

  @Input()
  set timeRange(value: boolean) {
    if (this._timeRange === value) {
      return;
    }

    this._timeRange = value;

    if (!value) {
      this.range = {
        start: this._range.start.clone().startOf('day'),
        end: this._range.end.clone().endOf('day')
      };
    }
  }

  get timeRange(): boolean {
    return this._timeRange;
  }

  @Input()
  set range(value) {
    if (!value) {
      return;
    }

    if (!value.start || !value.end) {
      console.error('Range input must have "start" and "end" properties!');
      return;
    }

    const whichDate = value.whichDate || null;

    const start = moment(value.start);
    const end = moment(value.end);

    if (whichDate === 'start') {
      this._range.start = start.clone();

      if (this._range.start.isAfter(this._range.end)) {
        const endDate = start.clone().hours(this._range.end.hours()).minutes(this._range.end.minutes()).seconds(this._range.end.seconds());

        if (this._range.start.isBefore(endDate)) {
          this._range.end = endDate;
        } else {
          this._range.end = start.clone();
        }
      }
    }

    if (whichDate === 'end') {
      this._range.end = end.clone();

      if (this._range.start.isAfter(this._range.end)) {
        const startDate = end.clone().hours(this._range.start.hours()).minutes(this._range.start.minutes()).seconds(this._range.start.seconds());

        if (this._range.end.isAfter(startDate)) {
          this._range.start = startDate;
        } else {
          this._range.start = end.clone();
        }
      }
    }

    if (!whichDate) {
      this._range.start = start.clone();
      this._range.end = start.isBefore(end) ? end.clone() : start.clone();
    }

    const range = {
      start: this._range.start.clone().toISOString(),
      end: this._range.end.clone().toISOString()
    };

    this.rangeChanged.emit(range);

    if (!this._programmaticChange) {
      this._onTouched(range);
      this._onChange(range);
    }

    this.activeDates = {
      month1: this._range.start.clone(),
      month2: this._range.start.clone().add(1, 'month')
    };

    this.startTimeFormControl.setValue(this._range.start.clone().format(this._timeFormat).toString());
    this.endTimeFormControl.setValue(this._range.end.clone().format(this._timeFormat).toString());

    if (this._matMonthView1 && this._matMonthView2) {
      this._matMonthView1.ngAfterContentInit();
      this._matMonthView2.ngAfterContentInit();
    }
    this._programmaticChange = false;
  }

  get range(): any {
    const start = this._range.start.clone();
    const end = this._range.end.clone();

    return {
      startDate: start.clone().format(this.dateFormat),
      startTime: this.timeRange ? start.clone().format(this.timeFormat) : null,
      endDate: end.clone().format(this.dateFormat),
      endTime: this.timeRange ? end.clone().format(this.timeFormat) : null
    };
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(range: { start: string; end: string }): void {
    this._programmaticChange = true;
    this.range = range;
  }

  ngOnInit(): void {
    moment.locale('de');

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    this.writeValue = (): void => {
    };
  }

  openPickerPanel(): void {
    const overlayRef = this._overlay.create({
      panelClass: 'fuse-date-range-panel',
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._pickerPanelOrigin)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 8
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -8
          }
        ])
    });

    const templatePortal = new TemplatePortal(this._pickerPanel, this._viewContainerRef);

    overlayRef.backdropClick().subscribe(() => {
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }

      if (overlayRef && overlayRef.hasAttached()) {
        overlayRef.detach();
        overlayRef.dispose();
      }
    });
    overlayRef.attach(templatePortal);
  }

  getMonthLabel(month: number): string {
    if (month === 1) {
      return this.activeDates.month1.clone().format('MMMM Y');
    }
    return this.activeDates.month2.clone().format('MMMM Y');
  }

  dateClass(): any {
    return (date: Moment): MatCalendarCellCssClasses => {
      if (date.isSame(this._range.start, 'day') && date.isSame(this._range.end, 'day')) {
        return ['fuse-date-range', 'fuse-date-range-start', 'fuse-date-range-end'];
      }
      if (date.isSame(this._range.start, 'day')) {
        return ['fuse-date-range', 'fuse-date-range-start'];
      }
      if (date.isSame(this._range.end, 'day')) {
        return ['fuse-date-range', 'fuse-date-range-end'];
      }
      if (date.isBetween(this._range.start, this._range.end, 'day')) {
        return ['fuse-date-range', 'fuse-date-range-mid'];
      }
      return undefined;
    };
  }

  dateFilter(): any {
    return (date: Moment): boolean => !(this.setWhichDate === 'end' && date.isBefore(this._range.start, 'day'));
  }

  onSelectedDateChange(date: Moment): void {
    const newRange = {
      start: this._range.start.clone().toISOString(),
      end: this._range.end.clone().toISOString(),
      whichDate: null
    };

    if (this.setWhichDate === 'start') {
      newRange.start = moment(newRange.start).year(date.year()).month(date.month()).date(date.date()).toISOString();
    } else {
      newRange.end = moment(newRange.end).year(date.year()).month(date.month()).date(date.date()).toISOString();
    }
    newRange.whichDate = this.setWhichDate;
    this.setWhichDate = this.setWhichDate === 'start' ? 'end' : 'start';
    this.range = newRange;
  }

  prev(): void {
    this.activeDates.month1 = moment(this.activeDates.month1).subtract(1, 'month');
    this.activeDates.month2 = moment(this.activeDates.month2).subtract(1, 'month');
  }

  next(): void {
    this.activeDates.month1 = moment(this.activeDates.month1).add(1, 'month');
    this.activeDates.month2 = moment(this.activeDates.month2).add(1, 'month');
  }

  updateStartTime(event): void {
    const parsedTime = this._parseTime(event.target.value);

    if (this.startTimeFormControl.invalid) {
      const time = this._range.start.clone().format(this._timeFormat);
      this.startTimeFormControl.setValue(time);
      return;
    }

    const startDate = this._range.start.clone().hours(parsedTime.hours()).minutes(parsedTime.minutes());

    if (startDate.isAfter(this._range.end)) {
      const endDateHours = this._range.end.hours();
      const endDateMinutes = this._range.end.minutes();

      startDate.hours(endDateHours).minutes(endDateMinutes);
    }

    this.range = {
      start: startDate.toISOString(),
      end: this._range.end.clone().toISOString(),
      whichDate: 'start'
    };
  }

  updateEndTime(event): void {
    const parsedTime = this._parseTime(event.target.value);

    if (this.endTimeFormControl.invalid) {
      const time = this._range.end.clone().format(this._timeFormat);
      this.endTimeFormControl.setValue(time);
      return;
    }

    const endDate = this._range.end.clone().hours(parsedTime.hours()).minutes(parsedTime.minutes());

    if (endDate.isBefore(this._range.start)) {
      const startDateHours = this._range.start.hours();
      const startDateMinutes = this._range.start.minutes();

      endDate.hours(startDateHours).minutes(startDateMinutes);
    }

    this.range = {
      start: this._range.start.clone().toISOString(),
      end: endDate.toISOString(),
      whichDate: 'end'
    };
  }

  private _init(): void {
    this.startTimeFormControl = new FormControl('', [Validators.pattern(this._timeRegExp)]);
    this.endTimeFormControl = new FormControl('', [Validators.pattern(this._timeRegExp)]);

    this._programmaticChange = true;
    this.range = {
      start: moment().startOf('day').toISOString(),
      end: moment().add(1, 'day').endOf('day').toISOString()
    };

    this._programmaticChange = true;
    this.timeRange = true;
  }

  private _parseTime(value: string): Moment {
    const timeArr = value.split(this._timeRegExp).filter(part => part !== '');
    const meridiem = timeArr[2] || null;

    if (meridiem) {
      return moment(value, 'hh:mmA').seconds(0);
    }
    return moment(value, 'HH:mm').seconds(0);
  }
}
