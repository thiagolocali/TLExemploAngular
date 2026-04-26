# TLExemploAngular

CRUD completo em Angular 19 com design elegante dark theme, usando Signals, Standalone Components e fake API via JSONPlaceholder.

## Tecnologias
- Angular 19 (Standalone Components)
- Signals (`signal`, `computed`)
- HttpClient com RxJS
- JSONPlaceholder como fake API

## Como rodar

### 1. Instalar o Angular CLI (caso não tenha)
```powershell
npm install -g @angular/cli
```

### 2. Instalar dependências
```powershell
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```powershell
npm start
```

Acesse: **http://localhost:4200**

## Estrutura do projeto
```
src/
├── app/
│   ├── components/
│   │   ├── toast/           # Notificações
│   │   ├── user-card/       # Card de usuário
│   │   └── user-modal/      # Modal criar/editar
│   ├── models/
│   │   └── user.model.ts    # Interface User
│   ├── services/
│   │   └── user.service.ts  # Chamadas HTTP (CRUD)
│   └── app.component.ts     # Componente raiz
├── styles.css                # CSS global + variáveis
└── main.ts                   # Bootstrap
```

## Funcionalidades
- ✅ **Listar** usuários via GET
- ✅ **Criar** usuário via POST
- ✅ **Editar** usuário via PUT
- ✅ **Excluir** usuário via DELETE
- ✅ Busca em tempo real
- ✅ Skeleton loading
- ✅ Toast notifications
- ✅ Modal animado
- ✅ Design dark theme elegante
