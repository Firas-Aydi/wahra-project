import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User | null>;
  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role === 'admin'; // Assurez-vous que le rôle de l'utilisateur est défini
  }
  constructor(private fireauth: AngularFireAuth) {
    this.user = this.fireauth.user;
   }
   signUp(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.fireauth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.fireauth.signInWithEmailAndPassword(email, password);
  }
}
