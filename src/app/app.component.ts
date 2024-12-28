import { Component, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Topic {
  id: number;
  title: string;
  description: string;
  published: Date;
  link: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MarkdownViewerComponent,
    DatePipe,
  ],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements OnInit {
  private modalService = inject(NgbModal);
  private http = inject(HttpClient);

  topics = signal<Topic[]>([]);

  ngOnInit(): void {
    this.http.get<Topic[]>('./topics.json').subscribe((data: Topic[]) => {
      this.topics.set(data);
    });
  }

  openTopicsModal(temp: TemplateRef<any>) {
    this.modalService.open(temp, {
      animation: true,
      scrollable: true,
      fullscreen: true,
      centered: true,
    });
  }
}
