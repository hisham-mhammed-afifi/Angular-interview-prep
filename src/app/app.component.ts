import { Component, inject, TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MarkdownViewerComponent],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  private modalService = inject(NgbModal);

  openTopicsModal(temp: TemplateRef<any>) {
    this.modalService.open(temp, {
      animation: true,
      scrollable: true,
      size: 'lg',
      centered: true,
    });
  }
}
