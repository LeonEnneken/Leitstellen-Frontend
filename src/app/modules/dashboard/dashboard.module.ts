import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Route, RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseDateRangeModule } from '@fuse/components/date-range';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { ControlCenterSheetModule } from 'app/layout/common/control-center-sheet/control-center-sheet.module';
import { SearchVehicleModule } from 'app/layout/common/search-vehicle/search-vehicle.module';
import { SearchModule } from 'app/layout/common/search/search.module';
import { SharedModule } from 'app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';

import { MainComponent } from './main/main.component';

import { ControlCenterComponent } from './contol-center/control-center.component';
import { ControlCenterOverviewComponent } from './contol-center/overview/overview.component';
import { ControlCenterSheetComponent } from './contol-center/sheet/sheet.component';

import { HRManagementComponent } from './hr-management/hr-management.component';
import { HRManagementMembersComponent } from './hr-management/members/members.component';

import { SearchMemberModule } from 'app/layout/common/search-member/search-member.module';
import { SettingsControlCentersComponent } from './settings/control-centers/control-centers.component';
import { SettingsDepartmentsComponent } from './settings/departments/departments.component';
import { SettingsGroupsComponent } from './settings/groups/groups.component';
import { SettingsRadioCodesComponent } from './settings/radio-codes/radio-codes.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsSettingsComponent } from './settings/settings/settings.component';
import { SettingsVehiclesComponent } from './settings/vehicles/vehicles.component';

import { DragAndDropModule } from 'app/layout/common/drag-and-drop/drag-and-drop.module';
import { AdminComponent } from './admin/admin.component';
import { AdminAuditLogsComponent } from './admin/audit-logs/audit-logs.component';
import { AdminConnectionsComponent } from './admin/connections/connections.component';
import { AdminManageComponent } from './admin/manage/manage.component';
import { HRManagementFileSheetsArchiveComponent } from './hr-management/file-sheets-archive/file-sheets-archive.component';
import { HRManagementFileSheetsStrikesComponent } from './hr-management/file-sheets-strikes/file-sheets-strikes.component';
import { HRManagementFileSheetsComponent } from './hr-management/file-sheets/file-sheets.component';
import { HRManagementTrackingsComponent } from './hr-management/trackings/trackings.component';
import { InformationComponent } from './information/information.component';
import { InformationPhoneNumbersComponent } from './information/phone-numbers/phone-numbers.component';
import { InformationPunishmentsComponent } from './information/punishments/punishments.component';
import { InformationRanksComponent } from './information/ranks/ranks.component';
import { ProfileOwnComponent } from './profile/own/own.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsControlCenterStatusComponent } from './settings/control-center-status/control-center-status.component';
import { SettingsNavigationComponent } from './settings/navigation/navigation.component';

const routes: Route[] = [{
  path: 'dashboard',
  component: MainComponent
}, {
  path: 'information',
  component: InformationComponent,
  children: [{
    path: 'phone-numbers',
    component: InformationPhoneNumbersComponent
  }, {
    path: 'punishments',
    component: InformationPunishmentsComponent
  }, {
    path: 'ranks',
    component: InformationRanksComponent
  }]
}, {
  path: 'control-center',
  component: ControlCenterComponent,
  children: [{
    path: 'overview',
    component: ControlCenterOverviewComponent
  }, {
    path: 'sheet',
    component: ControlCenterSheetComponent
  }]
}, {
  path: 'hr-management',
  component: HRManagementComponent,
  children: [{
    path: 'file-sheets',
    component: HRManagementComponent,
    children: [{
      path: '',
      component: HRManagementFileSheetsComponent
    }, {
      path: 'archives',
      component: HRManagementFileSheetsArchiveComponent
    }, {
      path: 'strikes',
      component: HRManagementFileSheetsStrikesComponent
    }]
  }, {
    path: 'members',
    component: HRManagementMembersComponent
  }, {
    path: 'trackings',
    component: HRManagementTrackingsComponent
  }]
}, {
  path: 'admin',
  component: AdminComponent,
  children: [{
    path: 'audit-logs',
    component: AdminAuditLogsComponent
  }, {
    path: 'connections',
    component: AdminConnectionsComponent
  }, {
    path: 'manage',
    component: AdminManageComponent
  }]
}, {
  path: 'profile',
  component: ProfileComponent,
  children: [{
    path: '',
    component: ProfileOwnComponent
  }]
}, {
  path: 'settings',
  component: SettingsComponent
}];

export const customPaginator = () => {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.firstPageLabel = 'Erste Seite';
  customPaginatorIntl.itemsPerPageLabel = 'pro Seite:';
  customPaginatorIntl.previousPageLabel = 'Letzte Seite';
  customPaginatorIntl.nextPageLabel = 'Nächste Seite';

  customPaginatorIntl.getRangeLabel = (page, pageSize, length) => {
    return `${(page * pageSize) + 1} - ${pageSize * (page + 1)} von ${length}`;
  };

  return customPaginatorIntl;
};

@NgModule({
  declarations: [
    ControlCenterSheetComponent,

    MainComponent,

    InformationComponent,
    InformationPhoneNumbersComponent,
    InformationPunishmentsComponent,
    InformationRanksComponent,

    ControlCenterComponent,
    ControlCenterOverviewComponent,
    ControlCenterSheetComponent,

    HRManagementComponent,
    HRManagementFileSheetsComponent,
    HRManagementFileSheetsArchiveComponent,
    HRManagementFileSheetsStrikesComponent,
    HRManagementMembersComponent,
    HRManagementTrackingsComponent,

    SettingsComponent,
    SettingsControlCenterStatusComponent,
    SettingsControlCentersComponent,
    SettingsDepartmentsComponent,
    SettingsGroupsComponent,
    SettingsNavigationComponent,
    SettingsRadioCodesComponent,
    SettingsSettingsComponent,
    SettingsVehiclesComponent,

    AdminComponent,
    AdminAuditLogsComponent,
    AdminConnectionsComponent,
    AdminManageComponent,

    ProfileComponent,
    ProfileOwnComponent,
  ],
  imports: [
    SearchVehicleModule,
    SearchMemberModule,
    FuseMasonryModule,
    DragAndDropModule,
    MatRippleModule,
    NgApexchartsModule,
    ScrollingModule,
    FuseCardModule,
    MatDatepickerModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule,
    MatMenuModule,
    FuseAlertModule,
    MatMomentDateModule,
    MatRadioModule,
    MatProgressBarModule,
    MatSliderModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatDividerModule,
    DragDropModule,
    FullCalendarModule,
    FuseDateRangeModule,
    ControlCenterSheetModule,
    SearchModule,
    SharedModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatSortModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    RouterModule.forChild(routes)
  ],
  providers: [{
    provide: MAT_DATE_LOCALE,
    useValue: 'de'
  }, {
    provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    useValue: {
      useUtc: true
    }
  }, {
    provide: MAT_DATE_FORMATS,
    useValue: {
      parse: {
        dateInput: 'DD.MM.YYYY'
      },
      display: {
        dateInput: 'DD.MM.YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD.MM.YYYY',
        monthYearA11yLabel: 'MMMM YYYY'
      }
    }
  }, {
    provide: MatPaginatorIntl,
    useValue: customPaginator()
  }]
})
export class DashboardModule {

}
