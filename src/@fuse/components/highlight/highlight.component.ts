import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EmbeddedViewRef, Input, OnChanges, SecurityContext, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FuseHighlightService } from '@fuse/components/highlight/highlight.service';

@Component({
  selector: 'textarea[fuse-highlight]',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'fuseHighlight'
})
export class FuseHighlightComponent implements OnChanges, AfterViewInit {

  @Input() code: string;
  @Input() lang: string;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  highlightedCode: string;
  private _viewRef: EmbeddedViewRef<any>;

  constructor(
    private _domSanitizer: DomSanitizer,
    private _elementRef: ElementRef,
    private _fuseHighlightService: FuseHighlightService,
    private _viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('code' in changes || 'lang' in changes) {
      if (!this._viewContainerRef.length) {
        return;
      }
      this._highlightAndInsert();
    }
  }

  ngAfterViewInit(): void {
    if (!this.lang) {
      return;
    }
    if (!this.code) {
      this.code = this._elementRef.nativeElement.value;
    }
    this._highlightAndInsert();
  }

  private _highlightAndInsert(): void {
    if (!this.templateRef) {
      return;
    }
    if (!this.code || !this.lang) {
      return;
    }
    if (this._viewRef) {
      this._viewRef.destroy();
      this._viewRef = null;
    }
    this.highlightedCode = this._domSanitizer.sanitize(SecurityContext.HTML, this._fuseHighlightService.highlight(this.code, this.lang));

    if (this.highlightedCode === null) {
      return;
    }

    this._viewRef = this._viewContainerRef.createEmbeddedView(this.templateRef, {
      highlightedCode: this.highlightedCode,
      lang: this.lang
    });

    this._viewRef.detectChanges();
  }
}
