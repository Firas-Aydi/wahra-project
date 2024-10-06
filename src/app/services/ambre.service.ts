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

  // updateAmbre(amb: Ambre) {
  //   this.deleteAmbre(amb);
  //   this.addAmbre(amb);
  // }
  updateAmbre(id: string, updatedData: Partial<Ambre>) {
    return this.afs.collection('/Ambre').doc(id).update(updatedData);
  }

  // updateAmbre(ambre: Ambre): Promise<void> {
  //   const documentId = ambre.id; // Get the document ID from the object
  //   return this.afs.collection('/Ambre').doc(documentId).update({
  //     name: ambre.name,
  //     price: ambre.price,
  //     description: ambre.description,
  //     imageUrl: ambre.imageUrl,
  //     stock: ambre.stock,
  //     createdAt: ambre.createdAt,
  //     updatedAt: new Date(), // Update the timestamp
  //     discount: ambre.discount,
  //   });
  // }
  
}
