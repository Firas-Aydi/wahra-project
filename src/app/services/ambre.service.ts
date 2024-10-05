import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Ambre } from '../model/ambre';

@Injectable({
  providedIn: 'root',
})
export class AmbreService {
  constructor(private afs: AngularFirestore) {}

  addAmbre(amb: Ambre) {
    amb.id = this.afs.createId();
    return this.afs.collection('/Ambre').add(amb);
  }

  getAllAmbre() {
    return this.afs.collection('/Ambre').snapshotChanges();
  }

  deleteAmbre(amb: Ambre) {
    return this.afs.doc('/Ambre/' + amb.id).delete();
  }

  updateAmbre(amb: Ambre) {
    this.deleteAmbre(amb);
    this.addAmbre(amb);
  }
}
