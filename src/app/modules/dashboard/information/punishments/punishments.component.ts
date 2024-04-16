import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BackendPunishment, BackendPunishmentCategory, PunishmentItemBody, PunishmentsService } from 'app/core/services/punishments.service';
import { UserService } from 'app/core/services/user.service';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'punishments',
  templateUrl: './punishments.component.html',
  styleUrls: ['./punishments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InformationPunishmentsComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  flashMessage: 'success' | 'error' = undefined;

  punishmentCategories: BackendPunishmentCategory[];

  searchInputControl = new FormControl();
  searchValue = '';

  categoryForm: FormGroup;
  selectedForm: FormGroup;

  selectedPunishment: BackendPunishment = undefined;

  showCategoryForm = false;
  newPunishment = false;

  constructor(
    private _punishmentsService: PunishmentsService,
    private _userService: UserService,

    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService
  ) {

  }

  ngOnInit(): void {
    this.categoryForm = this._formBuilder.group({
      uniqueId: [0, Validators.required],
      label: ['', Validators.required],
    });

    this.selectedForm = this._formBuilder.group({
      uniqueId: [0, Validators.required],
      description: ['', Validators.required],
    });

    this.searchInputControl.valueChanges.pipe(takeUntil(this._unsubscribeAll), debounceTime(300), switchMap((query) => {
      this.searchValue = query;
      return of(true);
    })).subscribe();

    this.loadPunishments();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  hasPermissions(permission: string) {
    return this._userService.hasPermissions(permission);
  }

  closeEdit() {
    this.selectedPunishment = undefined;
  }

  toggleEdit(id: string) {
    if (this.selectedPunishment && this.selectedPunishment.id === id) {
      this.closeEdit();
      return;
    }

    const punishments = this.punishmentCategories.flatMap((category) => category.punishments);
    const punishment = punishments.find((x) => x.id === id);

    if (!(punishment))
      return;
    this.selectedPunishment = punishment;

    this.selectedForm.patchValue(this.selectedPunishment);

    if (!(this.hasPermissions('PUNISHMENTS_MANAGE')))
      this.selectedForm.disable();
  }

  addCategory() {
    if(this.categoryForm.invalid)
      return;
    const form = this.categoryForm.getRawValue();

    this._punishmentsService.post(form).subscribe(() => {
      this.categoryForm.controls.uniqueId.setValue(undefined);
      this.categoryForm.controls.label.setValue(undefined);
      this.loadPunishments();
    }, (error) => {
      console.error(error);
    });
  }

  deleteCategory(categoryId: string) {
    this._punishmentsService.delete(categoryId).subscribe(() => {
      this.loadPunishments();
    }, (error) => {
      console.error(error);
    });
  }

  addPunishment(categoryId: string) {
    const category = this.punishmentCategories.find((x) => x.id === categoryId);

    if (!(category))
      return;
    category.punishments.push({
      id: undefined,
      categoryId: category.id,
      uniqueId: (category.punishments.length + 1),
      description: '',
      items: [],
      updatedAt: new Date(),
      createdAt: new Date()
    });
  }

  deletePunishment() {
    if (!(this.selectedPunishment))
      return;
    const { id, categoryId } = this.selectedPunishment;

    if (id === undefined) {
      const category = this.punishmentCategories.find((x) => x.id === categoryId);

      if (!(category))
        return;
      category.punishments.pop();
      return;
    }
    this._punishmentsService.deletePunishment(categoryId, id).subscribe(() => {
      this.loadPunishments();
    }, (error) => {
      console.error(error);
    });
  }

  savePunishment() {
    const categoryId = this.selectedPunishment.categoryId;
    const form = this.selectedForm.getRawValue();

    const items: PunishmentItemBody[] = [];

    this.selectedPunishment.items.forEach((item) => {
      items.push({
        id: item.id || undefined,
        stage: item.stage,
        strikes: item.strikes,
        additionalPunishment: item.additionalPunishment
      });
    });

    if (this.selectedPunishment.id === undefined) {
      this._punishmentsService.postPunishment(categoryId, {
        uniqueId: form.uniqueId,
        description: form.description,
        items: items
      }).subscribe(() => {
        this.loadPunishments();
        this.showFlashMessage('success');
      }, (error) => {
        console.error(error);
        this.showFlashMessage('error');
      });
      return;
    }

    this._punishmentsService.patchPunishment(categoryId, this.selectedPunishment.id, {
      uniqueId: form.uniqueId,
      description: form.description,
      items: items
    }).subscribe(() => {
      this.loadPunishments();
      this.showFlashMessage('success');
    }, (error) => {
      console.error(error);
      this.showFlashMessage('error');
    });
  }

  addPunishmentItem() {
    if (!(this.selectedPunishment))
      return;
    this.selectedPunishment.items.push({
      id: undefined,
      punishmentId: this.selectedPunishment.id,
      stage: (this.selectedPunishment.items.length + 1),
      strikes: 0,
      additionalPunishment: '',
      updatedAt: new Date(),
      createdAt: new Date()
    });
  }

  deletePunishmentItem(index: number) {
    if (!(this.selectedPunishment))
      return;
    const item = this.selectedPunishment.items[index];

    if (item && item.id === undefined) {
      this.selectedPunishment.items.splice(index, 1);
      return;
    }
    const { id, categoryId } = this.selectedPunishment;

    this._punishmentsService.deletePunishmentItem(categoryId, id, item.id).subscribe(() => {
      this.loadPunishments();
    }, (error) => {
      console.error(error);
    });
  }

  private loadPunishments() {
    this.selectedPunishment = undefined;
    
    this._punishmentsService.getAll().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.punishmentCategories = response;
    }, (error) => {
      console.error(error);
    });
  }

  private showFlashMessage(type: 'success' | 'error'): void {
    this.flashMessage = type;

    setTimeout(() => {
      this.flashMessage = null;
    }, 3000);
  }
}
