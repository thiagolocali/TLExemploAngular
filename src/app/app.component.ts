import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { User, UserForm } from './models/user.model';
import { UserCardComponent } from './components/user-card/user-card.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { ToastComponent } from './components/toast/toast.component';

interface Toast { message: string; type: 'success' | 'error' | 'info'; id: number; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, UserCardComponent, UserModalComponent, ToastComponent],
  template: `
    <!-- HEADER -->
    <header class="header">
      <div class="header-bg"></div>
      <div class="container header-inner">
        <div>
          <div class="label">Painel de Gestão</div>
          <h1>Usuários<span class="dot">.</span></h1>
          <p class="subtitle">{{ users().length }} usuários · API JSONPlaceholder</p>
        </div>
        <button class="btn-new" (click)="openCreate()">
          <span>+</span> Novo Usuário
        </button>
      </div>
    </header>

    <!-- MAIN -->
    <main class="container main">

      <!-- SEARCH + STATS -->
      <div class="toolbar">
        <div class="search-wrap">
          <span class="search-icon">⌕</span>
          <input
            class="search-input"
            [(ngModel)]="search"
            placeholder="Pesquisar por nome, e-mail ou empresa..."
          />
          <button *ngIf="search" class="search-clear" (click)="search=''">✕</button>
        </div>
        <div class="stats">
          <div class="stat">
            <span class="stat-val">{{ users().length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat">
            <span class="stat-val" style="color:var(--accent2)">{{ filtered().length }}</span>
            <span class="stat-label">Filtrados</span>
          </div>
        </div>
      </div>

      <!-- SKELETON -->
      <div *ngIf="loading()" class="grid">
        <div class="skeleton" *ngFor="let i of skeletons"></div>
      </div>

      <!-- EMPTY -->
      <div *ngIf="!loading() && filtered().length === 0" class="empty">
        <div class="empty-icon">◎</div>
        <p>Nenhum usuário encontrado.</p>
      </div>

      <!-- GRID -->
      <div *ngIf="!loading() && filtered().length > 0" class="grid">
        <app-user-card
          *ngFor="let user of filtered(); trackBy: trackById"
          [user]="user"
          (edit)="openEdit($event)"
          (delete)="handleDelete($event)"
          class="card-item"
        />
      </div>
    </main>

    <!-- MODAL -->
    <app-user-modal
      *ngIf="modalOpen()"
      [user]="editingUser()"
      [saving]="saving()"
      (save)="handleSave($event)"
      (close)="closeModal()"
    />

    <!-- TOASTS -->
    <app-toast
      *ngFor="let t of toasts()"
      [message]="t.message"
      [type]="t.type"
      (closed)="removeToast(t.id)"
    />
  `,
  styles: [`
    .header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 48px 0 80px;
      position: relative; overflow: hidden;
    }
    .header-bg {
      position: absolute; inset: 0; pointer-events: none;
      background:
        radial-gradient(ellipse at 10% 60%, rgba(232,255,71,0.07) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 20%, rgba(71,255,212,0.07) 0%, transparent 50%);
    }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 28px; }
    .header-inner {
      display: flex; align-items: center;
      justify-content: space-between; flex-wrap: wrap; gap: 20px;
      position: relative;
    }
    .label {
      font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: var(--accent); margin-bottom: 10px;
    }
    h1 {
      font-family: var(--font-display); font-size: 48px;
      font-weight: 800; color: var(--text); line-height: 1;
    }
    .dot { color: var(--accent); }
    .subtitle { color: var(--muted); font-size: 15px; margin-top: 8px; }
    .btn-new {
      background: var(--accent); color: #0d0d14;
      border: none; border-radius: 12px;
      padding: 14px 28px; font-family: var(--font-body);
      font-size: 16px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; gap: 8px;
      transition: all 0.2s; box-shadow: 0 4px 20px rgba(232,255,71,0.25);
    }
    .btn-new span { font-size: 22px; line-height: 1; }
    .btn-new:hover { background: var(--accent2); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(71,255,212,0.3); }

    .main { margin-top: -48px; padding-bottom: 60px; }

    .toolbar {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px 20px;
      display: flex; align-items: center; gap: 20px;
      flex-wrap: wrap; margin-bottom: 28px;
      box-shadow: var(--shadow);
    }
    .search-wrap {
      flex: 1; display: flex; align-items: center; gap: 10px; min-width: 200px;
    }
    .search-icon { font-size: 20px; color: var(--muted); }
    .search-input {
      flex: 1; background: none; border: none; outline: none;
      color: var(--text); font-family: var(--font-body); font-size: 15px;
    }
    .search-input::placeholder { color: var(--muted); }
    .search-clear {
      background: var(--surface2); border: 1px solid var(--border);
      color: var(--muted); border-radius: 6px; width: 24px; height: 24px;
      cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center;
    }
    .stats { display: flex; gap: 24px; }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-val { font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--accent); }
    .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 18px;
      animation: fadeUp 0.4s ease;
    }
    .skeleton {
      height: 210px; border-radius: var(--radius);
      background: linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    .empty {
      text-align: center; padding: 80px 0;
      color: var(--muted); font-size: 17px;
      animation: fadeUp 0.3s ease;
    }
    .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }
  `]
})
export class AppComponent implements OnInit {
  private userService = inject(UserService);

  users    = signal<User[]>([]);
  loading  = signal(true);
  saving   = signal(false);
  modalOpen   = signal(false);
  editingUser = signal<User | null>(null);
  toasts   = signal<Toast[]>([]);

  search = '';
  skeletons = Array(6);

  filtered = computed(() => {
    const q = this.search.toLowerCase();
    if (!q) return this.users();
    return this.users().filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company.toLowerCase().includes(q)
    );
  });

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: users => { this.users.set(users); this.loading.set(false); },
      error: ()    => { this.notify('Erro ao carregar usuários', 'error'); this.loading.set(false); }
    });
  }

  openCreate() { this.editingUser.set(null); this.modalOpen.set(true); }
  openEdit(user: User) { this.editingUser.set(user); this.modalOpen.set(true); }
  closeModal() { this.modalOpen.set(false); this.editingUser.set(null); }

  handleSave(form: UserForm) {
    this.saving.set(true);
    const editing = this.editingUser();

    if (editing) {
      this.userService.update({ ...form, id: editing.id }).subscribe({
        next: updated => {
          this.users.update(list => list.map(u => u.id === updated.id ? updated : u));
          this.closeModal();
          this.notify('Usuário atualizado!');
          this.saving.set(false);
        },
        error: () => { this.notify('Erro ao atualizar', 'error'); this.saving.set(false); }
      });
    } else {
      this.userService.create(form).subscribe({
        next: created => {
          this.users.update(list => [created, ...list]);
          this.closeModal();
          this.notify('Usuário criado com sucesso!');
          this.saving.set(false);
        },
        error: () => { this.notify('Erro ao criar usuário', 'error'); this.saving.set(false); }
      });
    }
  }

  handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    this.userService.delete(id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.id !== id));
        this.notify('Usuário removido!');
      },
      error: () => this.notify('Erro ao excluir', 'error')
    });
  }

  notify(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = Date.now();
    this.toasts.update(t => [...t, { message, type, id }]);
  }

  removeToast(id: number) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }

  trackById(_: number, user: User) { return user.id; }
}
