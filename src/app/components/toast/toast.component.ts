import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" [ngClass]="type">
      <span class="icon">{{ icon }}</span>
      <span>{{ message }}</span>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 9999;
      padding: 14px 24px;
      border-radius: 12px;
      font-family: var(--font-body);
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      animation: toastIn 0.3s cubic-bezier(.4,0,.2,1);
      color: #0d0d14;
    }
    .toast.success { background: var(--success); }
    .toast.error   { background: var(--danger); color: #fff; }
    .toast.info    { background: var(--accent); }
    .icon { font-size: 16px; }
  `]
})
export class ToastComponent implements OnInit {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'success';
  @Output() closed = new EventEmitter<void>();

  get icon() {
    return this.type === 'success' ? '✓' : this.type === 'error' ? '✕' : 'ℹ';
  }

  ngOnInit() {
    setTimeout(() => this.closed.emit(), 3000);
  }
}
