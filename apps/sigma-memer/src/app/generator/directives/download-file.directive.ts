import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[sigmaMemerDownloadFile]',
})
export class DownloadFileDirective {
  @Input() fileUrl!: string;
  @Input() fileName!: string | null;
  @Output() downloaded = new EventEmitter();
  constructor(el: ElementRef) {
    el.nativeElement.addEventListener('click', this.downloadFile.bind(this));
  }

  downloadFile() {
    const link = document.createElement('a');
    link.href = this.fileUrl;
    link.download = (this.fileName || 'file') + '.png';
    link.target = '_self';
    link.click();
    this.downloaded.emit();
  }
}
