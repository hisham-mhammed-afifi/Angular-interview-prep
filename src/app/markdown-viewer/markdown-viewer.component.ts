import { JsonPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-viewer',
  imports: [MarkdownComponent, JsonPipe],
  templateUrl: './markdown-viewer.component.html',
  styles: [],
})
export class MarkdownViewerComponent {
  filePath = input.required<string>();
  loading = signal(true);
  error = signal('');

  onLoad(content: string) {
    console.log(content);
    this.loading.set(false);
  }

  onError(error: any) {
    this.error.set(error.message ? error.message : error); // handle error
  }
}
