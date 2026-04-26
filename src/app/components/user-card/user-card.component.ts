import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.hovered]="hovered"
         (mouseenter)="hovered=true" (mouseleave)="hovered=false">
      <div class="card-top">
        <div class="avatar" [style.background]="avatarColor">{{ initials }}</div>
        <div class="info">
          <div class="name">{{ user.name }}</div>
          <div class="company">{{ user.company }}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="details">
        <div class="detail"><span class="di">✉</span>{{ user.email }}</div>
        <div class="detail"><span class="di">☎</span>{{ user.phone }}</div>
      </div>
      <div class="actions">
        <button class="btn-edit" (click)="edit.emit(user)">Editar</button>
        <button class="btn-del"  (click)="delete.emit(user.id)">Excluir</button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--surface); border: 1.5px solid var(--border);
      border-radius: var(--radius); padding: 22px;
      display: flex; flex-direction: column; gap: 16px;
      transition: all 0.22s cubic-bezier(.4,0,.2,1);
      cursor: default;
    }
    .card.hovered {
      border-color: var(--accent);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(232,255,71,0.1);
    }
    .card-top { display: flex; align-items: center; gap: 14px; }
    .avatar {
      width: 46px; height: 46px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-size: 16px;
      font-weight: 800; color: #0d0d14; flex-shrink: 0;
    }
    .name {
      font-family: var(--font-display); font-size: 16px;
      font-weight: 700; color: var(--text);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .company { font-size: 13px; color: var(--accent); font-weight: 600; margin-top: 2px; }
    .divider { height: 1px; background: var(--border); }
    .details { display: flex; flex-direction: column; gap: 8px; }
    .detail {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--muted);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .di { opacity: 0.5; flex-shrink: 0; }
    .actions { display: flex; gap: 10px; }
    .btn-edit, .btn-del {
      flex: 1; padding: 9px; border: none; border-radius: 10px;
      font-family: var(--font-body); font-size: 13px; font-weight: 700;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-edit { background: rgba(232,255,71,0.1); color: var(--accent); }
    .btn-edit:hover { background: rgba(232,255,71,0.2); }
    .btn-del  { background: rgba(255,71,87,0.1); color: var(--danger); }
    .btn-del:hover  { background: rgba(255,71,87,0.2); }
  `]
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() edit   = new EventEmitter<User>();
  @Output() delete = new EventEmitter<number>();

  hovered = false;

  get initials() {
    return this.user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  get avatarColor() {
    const hue = (this.user.name.charCodeAt(0) * 37 + (this.user.name.charCodeAt(1) || 0) * 13) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }
}
