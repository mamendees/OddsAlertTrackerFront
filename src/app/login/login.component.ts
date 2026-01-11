import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showPassword = false;
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef  // ← Add ChangeDetectorRef
  ) {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Login form
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

    // Register form
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.maxLength(100)]]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();  // ← Force change detection

    const credentials = {
      usernameOrEmail: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.isLoading = false;
        this.cdr.detectChanges();  // ← Force change detection
        
        // Save remember me preference
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('rememberedUser', credentials.usernameOrEmail);
        } else {
          localStorage.removeItem('rememberedUser');
        }

        // Navigate after short delay to show success message
        setTimeout(() => {
          this.router.navigate([this.returnUrl]);
        }, 800);
      },
      error: (error) => {
        console.error('Login error:', error);
        
        this.isLoading = false;
        
        // Handle different error response formats
        if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.title) {
          this.errorMessage = error.error.title;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid username/email or password. Please try again.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the API is running.';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
        
        this.cdr.detectChanges();  // ← Force change detection
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();  // ← Force change detection

    const userData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      name: this.registerForm.value.name || undefined
    };

    this.authService.register(userData).subscribe({
      next: (user) => {
        this.successMessage = 'Account created successfully! Please login.';
        this.isLoading = false;
        this.cdr.detectChanges();  // ← Force change detection
        
        // Switch to login mode and pre-fill username
        setTimeout(() => {
          this.isLoginMode = true;
          this.loginForm.patchValue({ usernameOrEmail: user.username });
          this.successMessage = '';
          this.cdr.detectChanges();  // ← Force change detection
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        
        this.isLoading = false;
        
        // Handle different error response formats
        if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else if (error.error?.errors) {
          // Validation errors
          const errors = error.error.errors;
          const errorMessages = Object.keys(errors)
            .map(key => errors[key].join(', '))
            .join('; ');
          this.errorMessage = errorMessages;
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the API is running.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
        
        this.cdr.detectChanges();  // ← Force change detection
      }
    });
  }

  ngOnInit() {
    // Load remembered username if exists
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      this.loginForm.patchValue({ 
        usernameOrEmail: remembered,
        rememberMe: true 
      });
    }
  }
}