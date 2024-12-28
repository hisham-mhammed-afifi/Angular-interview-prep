import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideMarkdown, MERMAID_OPTIONS } from 'ngx-markdown';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';

export const routes: Routes = [
  {
    path: ':title',
    component: MarkdownViewerComponent,
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideMarkdown({
      loader: HttpClient,
      mermaidOptions: {
        provide: MERMAID_OPTIONS,
        useValue: {
          darkMode: true,
          look: 'handDrawn',
        },
      },
    }),
  ],
};
