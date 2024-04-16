import { FuseNavigationItem } from '@fuse/components/navigation';

export const MENU: FuseNavigationItem[] = [{
  type: 'divider'
}, {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'basic',
  icon: 'heroicons_outline:chart-pie',
  link: '/dashboard'
}, {
  id: 'information',
  title: 'Informationen',
  type: 'collapsable',
  icon: 'heroicons_outline:information-circle',
  link: '/information',
  permissions: 'RANK_CONCEPT_SHOW MEMBERS_PHONE_NUMBER_SHOW PUNISHMENTS_SHOW',
  children: [{
    id: 'information-ranks',
    title: 'Rangkonzept',
    type: 'basic',
    link: '/information/ranks',
    permissions: 'RANK_CONCEPT_SHOW'
  }, {
    id: 'information-phone-numbers',
    title: 'Rufnummern Liste',
    type: 'basic',
    link: '/information/phone-numbers',
    permissions: 'MEMBERS_PHONE_NUMBER_SHOW'
  }, {
    id: 'information-punishments',
    title: 'Sanktions-Katalog',
    type: 'basic',
    link: '/information/punishments',
    permissions: 'PUNISHMENTS_SHOW'
  }]
}, {
  id: 'control-center',
  title: 'Leitstelle',
  type: 'collapsable',
  icon: 'heroicons_outline:adjustments',
  link: '/control-center',
  permissions: 'CONTROL_CENTERS_SHOW',
  children: [{
    id: 'control-center-overview',
    title: 'Übersicht',
    type: 'basic',
    link: '/control-center/overview',
    permissions: 'CONTROL_CENTERS_SHOW'
  }, {
    id: 'control-center-sheet',
    title: 'Dienstblatt',
    type: 'basic',
    link: '/control-center/sheet',
    permissions: 'CONTROL_CENTERS_SHOW'
  }]
}, {
  id: 'links',
  title: 'Wichtige Links',
  type: 'collapsable',
  icon: 'heroicons_outline:book-open',
  children: [{
    id: 'links-1',
    title: 'Öffentliches Gesetzbuch',
    type: 'basic',
    link: 'https://docs.google.com/document/d/1x50kjgeJxOhosOt2DFdomDcbN0vsHhbfMCumsEKqXHU',
    target: '_blank',
    externalLink: true
  }, {
    id: 'links-2',
    title: 'Beamten Dienst Gesetzbuch',
    type: 'basic',
    link: 'https://docs.google.com/document/d/19esv15Er0aDKQGDuc87OGsImMHf7cscwUIlCNB4BZOA',
    target: '_blank',
    externalLink: true
  }, {
    id: 'links-3',
    title: 'Straf & Busgeldkatalog',
    type: 'basic',
    link: 'https://docs.google.com/spreadsheets/d/1GFNZd1Y-VigjL-5n6mVGReGlcAqqww_1ZQzLvIaBDNs',
    target: '_blank',
    externalLink: true
  }, {
    id: 'links-4',
    title: 'Justizbetreibungs-Gesetz',
    type: 'basic',
    link: 'https://docs.google.com/document/d/1_pibxxY_JLlSFDJ8i_A7nrzw3JX4FS_iNKznY19QWCg',
    target: '_blank',
    externalLink: true
  }]
},


{
  type: 'divider',
  permissions: 'FILE_SHEETS_SHOW MEMBERS_SHOW'
}, {
  title: 'HR-Management',
  type: 'group',
  permissions: 'FILE_SHEETS_SHOW MEMBERS_SHOW STATISTICS_TRACKINGS_SHOW'
}, {
  id: 'hr-management-members',
  title: 'Mitarbeiter Liste',
  type: 'basic',
  icon: 'heroicons_outline:user-group',
  link: '/hr-management/members',
  permissions: 'MEMBERS_SHOW'
}, {
  id: 'hr-management-file-sheets',
  title: 'Sanktionen',
  type: 'collapsable',
  icon: 'heroicons_outline:clipboard-list',
  link: '/hr-management',
  permissions: 'FILE_SHEETS_SHOW',
  children: [{
    id: 'hr-management-file-sheet',
    title: 'Aktenblatt',
    type: 'basic',
    link: '/hr-management/file-sheets',
    permissions: 'FILE_SHEETS_SHOW',
    exactMatch: true
  }, {
    id: 'hr-management-file-sheet-archives',
    title: 'Akten-Archiv',
    type: 'basic',
    link: '/hr-management/file-sheets/archives',
    permissions: 'FILE_SHEETS_SHOW',
    exactMatch: true
  }, {
    id: 'hr-management-file-sheet-strikes',
    title: 'Strikes',
    type: 'basic',
    link: '/hr-management/file-sheets/strikes',
    permissions: 'FILE_SHEETS_SHOW',
    exactMatch: true
  }]
}, {
  id: 'hr-management-trackings',
  title: 'Zeit Tracking',
  type: 'basic',
  icon: 'heroicons_outline:clock',
  link: '/hr-management/trackings',
  permissions: 'STATISTICS_TRACKINGS_SHOW'
},

{
  type: 'divider',
  permissions: 'PANEL_MANAGE ADMIN_AREA_SHOW',
}, {
  title: 'Admin Area',
  type: 'group',
  permissions: 'PANEL_MANAGE ADMIN_AREA_SHOW'
}, {
  id: 'admin-audit-logs',
  title: 'Audit-Logs',
  type: 'basic',
  icon: 'heroicons_outline:database',
  link: '/admin/audit-logs',
  permissions: 'ADMIN_AREA_SHOW'
}, {
  id: 'admin-connections',
  title: 'Aktive Verbindungen',
  type: 'basic',
  icon: 'heroicons_outline:status-online',
  link: '/admin/connections',
  permissions: 'ADMIN_AREA_SHOW'
}, {
  id: 'admin-manage',
  title: 'Admins verwalten',
  type: 'basic',
  icon: 'heroicons_outline:adjustments',
  link: '/admin/manage',
  permissions: 'ADMIN_AREA_SHOW'
}];

/*

import { FuseNavigationItem } from '@fuse/components/navigation';

export const MENU: FuseNavigationItem[] = [{
  type: 'divider'
}, {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'basic',
  icon: 'heroicons_outline:chart-pie',
  link: '/dashboard'
}, {
  id: 'information',
  title: 'Informationen',
  type: 'collapsable',
  icon: 'heroicons_outline:information-circle',
  link: '/information',
  permissions: 'INFORMATION_SHOW SOLDIER_PHONE_NUMBERS_SHOW',
  children: [{
    id: 'information-department',
    title: 'Abteilungen',
    type: 'basic',
    link: '/information/department',
    permissions: 'INFORMATION_SHOW'
  }, {
    id: 'information-calendar',
    title: 'Kalendar',
    type: 'basic',
    link: '/information/calendar',
    permissions: 'CALENDARS_SHOW'
  }, {
    id: 'information-ranks',
    title: 'Rangkonzept',
    type: 'basic',
    link: '/information/ranks',
    permissions: 'INFORMATION_SHOW'
  }, {
    id: 'information-phone-numbers',
    title: 'Rufnummern Liste',
    type: 'basic',
    link: '/information/phone-numbers',
    permissions: 'SOLDIER_PHONE_NUMBERS_SHOW'
  }]
}, {
  id: 'information-details',
  title: 'Regelwerk & Sanktionen',
  type: 'collapsable',
  icon: 'heroicons_outline:academic-cap',
  link: '/information',
  permissions: 'INFORMATION_SHOW',
  children: [{
    id: 'information-rules',
    title: 'Regelwerk',
    type: 'basic',
    link: '/information/rules',
    permissions: 'INFORMATION_SHOW'
  }, {
    id: 'information-punishments',
    title: 'Sanktionskatalog',
    type: 'basic',
    link: '/information/punishments',
    permissions: 'INFORMATION_SHOW'
  }]
}, {
  id: 'control-center',
  title: 'Leitstelle',
  type: 'collapsable',
  icon: 'heroicons_outline:adjustments',
  link: '/control-center',
  permissions: 'CONTROL_CENTER_SHOW TIME_TRACKING_USE',
  children: [{
    id: 'control-center-overview',
    title: 'Übersicht',
    type: 'basic',
    link: '/control-center/overview',
    permissions: 'CONTROL_CENTER_SHOW'
  }, {
    id: 'control-center-sheet',
    title: 'Dienstblatt',
    type: 'basic',
    link: '/control-center/sheet',
    permissions: 'CONTROL_CENTER_SHOW'
  }, {
    id: 'control-center-sheet-mobile',
    title: 'Mobile Einheiten',
    type: 'basic',
    link: '/control-center/sheet-mobile',
    permissions: 'CONTROL_CENTER_SHOW'
  }, {
    id: 'control-center-sheet-convoy',
    title: 'Waffenkonvoi',
    type: 'basic',
    link: '/control-center/sheet-convoy',
    permissions: 'CONTROL_CENTER_SHOW'
  }]
}, {
  id: 'statistics',
  title: 'Statistiken',
  type: 'collapsable',
  icon: 'heroicons_outline:chart-pie',
  link: '/statistics',
  permissions: 'STATISTICS_SHOW',
  children: [{
    id: 'statistics-main',
    title: 'Übersicht',
    type: 'basic',
    link: '/statistics',
    permissions: 'STATISTICS_SHOW',
    exactMatch: true
  }, {
    id: 'statistics-human-labs',
    title: 'HumanLabs',
    type: 'basic',
    link: '/statistics/human-labs',
    permissions: 'STATISTICS_SHOW',
    exactMatch: true
  }, {
    id: 'statistics-gate-guards',
    title: 'Torwache',
    type: 'basic',
    link: '/statistics/gate-guards',
    permissions: 'STATISTICS_SHOW',
    exactMatch: true
  }]
}, {
  id: 'blacklist',
  title: 'Blacklist',
  type: 'basic',
  link: '/blacklist',
  icon: 'heroicons_outline:exclamation-circle',
  permissions: 'BLACKLISTS_GET',
  exactMatch: true
}, {
  type: 'divider',
  permissions: 'SOLDIERS_SHOW HUMAN_RESOURCES_CALENDARS_SHOW PUNISHMENTS_SHOW FILE_SHEETS_GET FILE_SHEETS_FINISHED_GET FILE_SHEETS_STRIKE_GET STATISTICS_TRACKINGS_SHOW DEPARTMENT_HR_MEMBERS_SHOW'
}, {
  title: 'HR-Management',
  type: 'group',
  permissions: 'SOLDIERS_SHOW HUMAN_RESOURCES_CALENDARS_SHOW PUNISHMENTS_SHOW FILE_SHEETS_GET FILE_SHEETS_FINISHED_GET FILE_SHEETS_STRIKE_GET STATISTICS_TRACKINGS_SHOW DEPARTMENT_HR_MEMBERS_SHOW'
}, {
  id: 'hr-management-members',
  title: 'Mitglieder',
  type: 'basic',
  icon: 'heroicons_outline:users',
  link: '/hr-management/members',
  permissions: 'DEPARTMENT_HR_MEMBERS_SHOW'
}, {
  id: 'hr-management-promotions',
  title: 'Beförderungen',
  type: 'basic',
  icon: 'heroicons_outline:speakerphone',
  link: '/hr-management/promotions',
  permissions: 'PROMOTIONS_SHOW'
}, {
  id: 'hr-management-calendar',
  title: 'Kalendar',
  type: 'basic',
  icon: 'heroicons_outline:calendar',
  link: '/hr-management/calendar',
  permissions: 'HUMAN_RESOURCES_CALENDARS_SHOW'
}, {
  id: 'hr-management-trackings',
  title: 'Zeit Tracking',
  type: 'basic',
  icon: 'heroicons_outline:clock',
  link: '/hr-management/trackings',
  permissions: 'STATISTICS_TRACKINGS_SHOW'
}, {
  id: 'hr-management-rules',
  title: 'Regeln verwalten',
  type: 'basic',
  icon: 'heroicons_outline:book-open',
  link: '/hr-management/rules',
  permissions: 'RULES_SHOW'
}, {
  id: 'information',
  title: 'Sanktionen',
  type: 'collapsable',
  icon: 'heroicons_outline:clipboard-list',
  link: '/hr-management',
  permissions: 'PUNISHMENTS_SHOW FILE_SHEETS_GET FILE_SHEETS_FINISHED_GET FILE_SHEETS_STRIKE_GET',
  children: [{
    id: 'hr-management-punishments',
    title: 'Strafenkatalog',
    type: 'basic',
    link: '/hr-management/punishments',
    permissions: 'PUNISHMENTS_SHOW'
  }, {
    id: 'hr-management-file-sheet',
    title: 'Aktenblatt',
    type: 'basic',
    link: '/hr-management/file-sheet',
    permissions: 'FILE_SHEETS_GET',
    exactMatch: true
  }, {
    id: 'hr-management-file-sheet-archives',
    title: 'Akten-Archiv',
    type: 'basic',
    link: '/hr-management/file-sheet/archives',
    permissions: 'FILE_SHEETS_FINISHED_GET',
    exactMatch: true
  }, {
    id: 'hr-management-strikes',
    title: 'Strikes',
    type: 'basic',
    link: '/hr-management/strikes',
    permissions: 'FILE_SHEETS_STRIKE_GET'
  }]
}, {
  id: 'hr-management-statistics',
  title: 'Statistiken',
  type: 'basic',
  icon: 'heroicons_outline:chart-pie',
  link: '/hr-management/statistics',
  permissions: 'FILE_SHEETS_GET'
}];
*/
