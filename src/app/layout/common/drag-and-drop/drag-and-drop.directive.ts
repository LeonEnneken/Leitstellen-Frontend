import { Directive, EventEmitter, HostBinding, HostListener, Output } from "@angular/core";

@Directive({
  selector: '[dragAndDrop]',
  exportAs: 'dragAndDrop'
})
export class DragAndDropDirective {

  @HostBinding('class.fileover') fileOver: boolean;

  @Output() fileDropped = new EventEmitter<any>();

  constructor() {

  }
  
  @HostListener('dragover', ['$event'])
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = false;

    const files = event.dataTransfer.files;

    if(files.length === 0)
      return;
    this.fileDropped.emit(files);
  }
}