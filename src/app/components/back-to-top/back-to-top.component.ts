import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button mat-fab
            class="back-to-top"
            [class.show]="isVisible"
            (click)="scrollToTop()"
            aria-label="Back to top">
      <mat-icon>arrow_upward</mat-icon>
    </button>
  `,
  styles: [`
    .back-to-top {
      position: fixed;
      bottom: 20px;
      right: 20px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      background-color: #ee1515; /* Pokemon Red */
      color: white;
    }

    .back-to-top.show {
      opacity: 1;
      visibility: visible;
    }

    @media (max-width: 768px) {
      .back-to-top {
        bottom: 16px;
        right: 16px;
      }
    }
  `]
})
export class BackToTopComponent {
  isVisible = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isVisible = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
} 