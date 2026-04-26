import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserForm } from '../../models/user.model';

const EMPTY: UserForm = { name: '', email: '', phone: '', company: '' };

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="overlay" (click)="onClose()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ user ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>

        <form (ngSubmit)="submit()" #f="ngForm">
          <div class="field" *ngFor="let field of fields">
            <label>{{ field.label }}</label>
            <input
              [(ngModel)]="form[field.key]"
              [name]="field.key"
              [type]="field.type"
              [placeholder]="field.placeholder"
              required
            />
          </div>

          <button type="submit" class="btn-save" [disabled]="saving || f.invalid">
            <span *ngIf="saving" class="spinner"></span>
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
    }
    .modal {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 20px; padding: 36px 40px;
      min-width: 420px; max-width: 520px; width: 90%;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      animation: modalIn 0.25s cubic-bezier(.4,0,.2,1);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 28px;
    }
    h2 {
      font-family: var(--font-display); font-size: 22px;
      color: var(--accent); font-weight: 800;
    }
    .close-btn {
      background: var(--surface2); border: 1px solid var(--border);
      color: var(--muted); border-radius: 8px;
      width: 34px; height: 34px; cursor: pointer; font-size: 20px;
      display: flex; align-items: center; justify-content: center;
      transition: color 0.15s;
    }
    .close-btn:hover { color: var(--text); }
    form { display: flex; flex-direction: column; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    label {
      font-size: 11px; font-weight: 700; color: var(--muted);
      text-transform: uppercase; letter-spacing: 0.1em;
    }
    input {
      padding: 12px 16px; background: var(--surface2);
      border: 1.5px solid var(--border); border-radius: 10px;
      color: var(--text); font-family: var(--font-body); font-size: 15px;
      outline: none; transition: border-color 0.2s;
    }
    input:focus { border-color: var(--accent); }
    input::placeholder { color: var(--muted); }
    .btn-save {
      margin-top: 8px; padding: 13px; background: var(--accent);
      color: #0d0d14; border: none; border-radius: 12px;
      font-family: var(--font-body); font-size: 16px; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-save:not(:disabled):hover { background: var(--accent2); transform: translateY(-1px); }
    .spinner {
      width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.2);
      border-top-color: #0d0d14; border-radius: 50%;
      animation: spin 0.7s linear infinite; display: inline-block;
    }
  `]
})
export class UserModalComponent implements OnInit {
  @Input() user: User | null = null;
  @Input() saving = false;
  @Output() save = new EventEmitter<UserForm>();
  @Output() close = new EventEmitter<void>();

  form: UserForm = { ...EMPTY };

  fields: { key: keyof UserForm; label: string; placeholder: string; type: string }[] = [
    { key: 'name',    label: 'Nome completo', placeholder: 'Ex: Maria Silva',       type: 'text'  },
    { key: 'email',   label: 'E-mail',        placeholder: 'maria@email.com',        type: 'email' },
    { key: 'phone',   label: 'Telefone',      placeholder: '(11) 99999-0000',        type: 'text'  },
    { key: 'company', label: 'Empresa',       placeholder: 'Nome da empresa',        type: 'text'  },
  ];

  ngOnInit() {
    this.form = this.user
      ? { name: this.user.name, email: this.user.email, phone: this.user.phone, company: this.user.company }
      : { ...EMPTY };
  }

  submit() { this.save.emit({ ...this.form }); }
  onClose() { this.close.emit(); }
}
