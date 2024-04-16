import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePipe } from '@fuse/pipes/time.pipe';

export interface AuditLogType {
  label: string;
  value: string;
}

export interface Permissions {
  title: string;
  items: PermissionItem[];
}

export interface PermissionItem {
  name: string;
  value: string;
}

export interface Equipment {
  name: string;
  amount: number;
}

@NgModule({
  declarations: [
    TimePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TimePipe
  ]
})
export class SharedModule {

  private auditLogTypes: AuditLogType[] = [{
    label: 'Nichts ausgewählt',
    value: 'EMPTY'
  }, {
    label: 'Dienstblatt - Bereich erstellt',
    value: 'CONTROL_CENTER_CREATED'
  }, {
    label: 'Dienstblatt - Bereich bearbeitet',
    value: 'CONTROL_CENTER_PATCHED'
  }, {
    label: 'Dienstblatt - Bereich gelöscht',
    value: 'CONTROL_CENTER_DELETED'
  }, {
    label: 'Dienstblatt - Status geändert',
    value: 'CONTROL_CENTER_PATCHED_STATUS'
  }, {
    label: 'Dienstblatt - Fahrzeug geändert',
    value: 'CONTROL_CENTER_PATCHED_VEHICLE'
  }, {
    label: 'Dienstblatt - Mitarbeiter hinzugefügt',
    value: 'CONTROL_CENTER_MEMBER_ADDED'
  }, {
    label: 'Dienstblatt - Mitarbeiter entfernt',
    value: 'CONTROL_CENTER_MEMBER_REMOVED'
  }, {
    label: 'Abteilung erstellt',
    value: 'DEPARTMENT_CREATED'
  }, {
    label: 'Abteilung bearbeitet',
    value: 'DEPARTMENT_PATCHED'
  }, {
    label: 'Abteilung gelöscht',
    value: 'DEPARTMENT_DELETED'
  }, {
    label: 'Rang erstellt',
    value: 'GROUP_CREATED'
  }, {
    label: 'Rang bearbeitet',
    value: 'GROUP_PATCHED'
  }, {
    label: 'Rang gelöscht',
    value: 'GROUP_DELETED'
  }, {
    label: 'Mitabeiter bearbeitet',
    value: 'MEMBER_PATCHED'
  }, {
    label: 'Mitarbeiter eingestellt',
    value: 'MEMBER_HIRED'
  }, {
    label: 'Mitarbeiter gekündigt',
    value: 'MEMBER_TERMINATED'
  }, {
    label: 'Mitarbeiter befördert',
    value: 'MEMBER_PROMOTED'
  }, {
    label: 'Mitarbeiter degradiert',
    value: 'MEMBER_DEMOTED'
  }, {
    label: 'Mitarbeiter Abteilungs-Änderung',
    value: 'MEMBER_DEPARTMENT_PATCHED'
  }, {
    label: 'Funk-Code erstellt',
    value: 'RADIO_CODE_CREATED'
  }, {
    label: 'Funk-Code bearbeitet',
    value: 'RADIO_CODE_PATCHED'
  }, {
    label: 'Funk-Code gelöscht',
    value: 'RADIO_CODE_DELETED'
  }, {
    label: 'Einstellung bearbeitet',
    value: 'SETTINGS_PATCHED'
  }, {
    label: 'Navigations-Details erstellt',
    value: 'SETTINGS_HEADER_DETAILS_CREATED'
  }, {
    label: 'Navigations-Details bearbeitet',
    value: 'SETTINGS_HEADER_DETAILS_PATCHED'
  }, {
    label: 'Navigations-Details gelöscht',
    value: 'SETTINGS_HEADER_DETAILS_DELETED'
  }, {
    label: 'Fahrzeug erstellt',
    value: 'VEHICLE_CREATED'
  }, {
    label: 'Fahrzeug bearbeitet',
    value: 'VEHICLE_PATCHED'
  }, {
    label: 'Fahrzeug gelöscht',
    value: 'VEHICLE_DELETED'
  }, {
    label: 'Benutzer bearbeitet',
    value: 'USER_PATCHED'
  }, {
    label: 'Benutzer bearbeitet (anderer Benutzer)',
    value: 'USER_PATCHED_OTHER'
  }, {
    label: 'Benutzer Status geändert',
    value: 'USER_STATUS'
  }, {
    label: 'Benutzer Status geändert (anderer Benutzer)',
    value: 'USER_STATUS_OTHER'
  }, {
    label: 'Sanktions-Katalog - Kategorie erstellt',
    value: 'PUNISHMENT_CATEGORY_CREATED'
  }, {
    label: 'Sanktions-Katalog - Kategorie bearbeitet',
    value: 'PUNISHMENT_CATEGORY_PATCHED'
  }, {
    label: 'Sanktions-Katalog - Kategorie gelöscht',
    value: 'PUNISHMENT_CATEGORY_DELETED'
  }, {
    label: 'Sanktions-Katalog - Strafe erstellt',
    value: 'PUNISHMENT_CREATED'
  }, {
    label: 'Sanktions-Katalog - Strafe bearbeitet',
    value: 'PUNISHMENT_PATCHED'
  }, {
    label: 'Sanktions-Katalog - Strafe gelöscht',
    value: 'PUNISHMENT_DELETED'
  }, {
    label: 'Sanktions-Katalog - Stufe erstellt',
    value: 'PUNISHMENT_ITEM_CREATED'
  }, {
    label: 'Sanktions-Katalog - Stufe bearbeitet',
    value: 'PUNISHMENT_ITEM_PATCHED'
  }, {
    label: 'Sanktions-Katalog - Stufe gelöscht',
    value: 'PUNISHMENT_ITEM_DELETED'
  }, {
    label: 'Sanktion erstellt',
    value: 'FILE_SHEET_CREATED'
  }, {
    label: 'Sanktion bearbeitet',
    value: 'FILE_SHEET_PATCHED'
  }, {
    label: 'Sanktion gelöscht',
    value: 'FILE_SHEET_DELETED'
  }, {
    label: 'Sanktion genehmigt',
    value: 'FILE_SHEET_APPROVED'
  }, {
    label: 'Sanktion abgebrochen',
    value: 'FILE_SHEET_CANCELED'
  }]

  private permissions: Permissions[] = [{
    title: 'Abteilungen & Ränge',
    items: [{
      name: 'Abteilungen verwalten',
      value: 'DEPARTMENTS_MANAGE'
    }, {
      name: 'Ränge verwalten',
      value: 'GROUPS_MANAGE'
    }]
  }, {
    title: 'Audit-Log',
    items: [{
      name: 'Audit-Logs einsehen',
      value: 'AUDIT_LOGS_SHOW'
    }]
  }, {
    title: 'Dateien',
    items: [{
      name: 'Dateien hochladen',
      value: 'UPLOAD_FILES'
    }]
  }, {
    title: 'Dienstblatt',
    items: [{
      name: 'Dienstblatt einsehen',
      value: 'CONTROL_CENTERS_SHOW'
    }, {
      name: 'Dienstblatt verwalten',
      value: 'CONTROL_CENTERS_MANAGE'
    }]
  }, {
    title: 'Einstellungen',
    items: [{
      name: 'Einstellungen verwalten',
      value: 'SETTINGS_MANAGE'
    }]
  }, {
    title: 'Fahrzeuge',
    items: [{
      name: 'Fahrzeuge verwalten',
      value: 'VEHICLES_MANAGE'
    }]
  }, {
    title: 'Funk-Codes',
    items: [{
      name: 'Funk-Codes einsehen',
      value: 'RADIO_CODES_SHOW'
    }, {
      name: 'Funk-Codes verwalten',
      value: 'RADIO_CODES_MANAGE'
    }]
  }, {
    title: 'Informationen Bereich',
    items: [{
      name: 'Rank Konzept einsehen',
      value: 'RANK_CONCEPT_SHOW'
    }, {
      name: 'Rufnummern Liste einsehen',
      value: 'MEMBERS_PHONE_NUMBER_SHOW'
    }, {
      name: 'Sanktions-Katalog einsehen',
      value: 'PUNISHMENTS_SHOW'
    }, {
      name: 'Sanktions-Katalog verwalten',
      value: 'PUNISHMENTS_MANAGE'
    }]
  }, {
    title: 'Mitabeiter',
    items: [{
      name: 'Mitarbeiter einsehen',
      value: 'MEMBERS_SHOW'
    }, {
      name: 'Mitarbeiter verwalten',
      value: 'MEMBERS_MANAGE'
    }, {
      name: 'Mitarbeiter Status verwalten',
      value: 'USER_STATUS_MANAGE'
    }]
  }, {
    title: 'Sanktionen',
    items: [{
      name: 'Sanktionen einsehen',
      value: 'FILE_SHEETS_SHOW'
    }, {
      name: 'Sanktionen verwalten',
      value: 'FILE_SHEETS_MANAGE'
    }, {
      name: 'Sanktionen genehmigen',
      value: 'FILE_SHEET_APPROVE'
    }]
  }, {
    title: 'Statistiken',
    items: [{
      name: 'Zeit Tracking einsehen',
      value: 'STATISTICS_TRACKINGS_SHOW'
    }]
  }];

  private equipments: Equipment[] = [{
    name: 'Pistole',
    amount: 0
  }, {
    name: 'Panzerbrechende Pistole',
    amount: 0
  }, {
    name: 'Tazer',
    amount: 0
  }, {
    name: 'PDW-Maschinenpistole',
    amount: 0
  }, {
    name: 'Schrotflinte',
    amount: 0
  }, {
    name: 'Schwere Schrotflinte',
    amount: 0
  }, {
    name: 'Sturmgewehr',
    amount: 0
  }, {
    name: 'Bullpup-Sturmgewehr',
    amount: 0
  }, {
    name: 'Scharfschützengewehr',
    amount: 0
  }, {
    name: 'Leichtes Maschinengewehr',
    amount: 0
  }, {
    name: 'Polizeischlagstock',
    amount: 0
  }, {
    name: 'Sturmgewehr-Karabiner',
    amount: 0
  }, {
    name: 'AUG-Sturmgewehr',
    amount: 0
  }, {
    name: 'Balaclava',
    amount: 0
  }];

  get getAuditLogTypes(): AuditLogType[] {
    return this.auditLogTypes;
  }

  get getPermissions(): Permissions[] {
    return this.permissions;
  }

  get getEquipments(): Equipment[] {
    return this.equipments;
  }

}
