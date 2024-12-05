export interface Utilisateur {
    id: string; // Identifiant unique
    name: string; // Nom complet de l'utilisateur
    email: string; // Email de l'utilisateur
    password: string; // Mot de passe
    role: 'admin' | 'client'; // Rôle (admin ou client)
    createdAt: Date; // Date de création du compte
  }
  