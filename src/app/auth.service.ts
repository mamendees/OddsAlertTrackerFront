import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponseDto {
  user: UserDto;
  message: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7201/api/Users';
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginDto): Observable<LoginResponseDto> {
  //   const user: UserDto = {
  //     id: 1,
  //     username: credentials.usernameOrEmail,
  //     email: credentials.usernameOrEmail,
      
  //   }
  //   const mockResponse: LoginResponseDto = {
  //   user: user,
  //   message: 'Login successful'
  // };

  // return of(mockResponse).pipe(
  //   delay(500), // simula request HTTP
  //   tap(response => {
  //     this.currentUserSubject.next(response.user);
  //     localStorage.setItem('currentUser', JSON.stringify(response.user));
  //     localStorage.setItem('userId', response.user.id.toString());
  //   })
  // );
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('userId', response.user.id.toString());
        })
      );
  }

  register(user: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  getUserId(): number | null {
    return this.currentUserSubject.value?.id ?? null;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored) as UserDto;
      this.currentUserSubject.next(user);
    }
  }
}