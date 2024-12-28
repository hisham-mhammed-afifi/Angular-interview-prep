import { JsonPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-viewer',
  imports: [MarkdownComponent, JsonPipe],
  templateUrl: './markdown-viewer.component.html',
  styles: [
    `
      :host {
        width: 100%;
        max-width: 60ch;
      }
    `,
  ],
})
export class MarkdownViewerComponent {
  private route = inject(ActivatedRoute);
  filePath = signal<string>('');
  loading = signal(true);
  error = signal('');

  constructor() {
    this.route.params.subscribe((params) => {
      this.filePath.set('./' + params['title']);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  onLoad(content: string) {
    console.log(content);
    this.loading.set(false);
  }

  onError(error: any) {
    this.error.set(`Can't find ${this.filePath()}.md`); // handle error
  }
}
