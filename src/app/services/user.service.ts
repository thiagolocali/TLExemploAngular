import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User, UserForm } from '../models/user.model';

interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: { name: string };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  getAll(): Observable<User[]> {
    return this.http.get<ApiUser[]>(this.apiUrl).pipe(
      map(users => users.slice(0, 8).map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        company: u.company.name,
      })))
    );
  }

  create(form: UserForm): Observable<User> {
    return this.http.post<ApiUser>(this.apiUrl, form).pipe(
      map(u => ({ ...form, id: Date.now() }))
    );
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      map(() => user)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
