import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SentenceService {

  constructor() {
    this.chargerPhrasesSorties()
  }

  phrases: string[] = [
    "Tout le monde doit t'appeller Djason / Anémone",
    "Tu dois mettre 'mbiau' / 'mbelle' dans tes phrases quand tu t'adresse à quelqu'un",
    "A partir de maintenant tu parles ch'ti",
    "Tu appelles tout le monde 'gros' / 'grosse'",
    "Tu dois rajouter des 'wesh' à la fin de te phrases",
    "Dans chacune de tes phrases, tu dois remplacer un de tes mots par 'carapils'",
    "A partir de maintenant, tu es un vrai baraki ! Adoptes en l'attitude"
  ];

  phrasesSorties: string[] = [];

  chargerPhrasesSorties(): void {
    const phrasesSortiesString = localStorage.getItem('phrasesSorties');
    if (phrasesSortiesString) {
      this.phrasesSorties = JSON.parse(phrasesSortiesString);

      // Retirer les phrases déjà sorties du pool initial
      this.phrases = this.phrases.filter((phrase) => !this.phrasesSorties.includes(phrase));
    }
  }
  getPhraseRandom(): string {
    if (this.phrases.length === 0) {
      // Rechargez les phrases si toutes ont été utilisées
      this.phrases = [...this.phrasesSorties];
      this.phrasesSorties = [];
    }

    const randomIndex = Math.floor(Math.random() * this.phrases.length);
    const phrase = this.phrases.splice(randomIndex, 1)[0];
    this.phrasesSorties.push(phrase);

    // Sauvegarder dans le localStorage
    localStorage.setItem('phrasesSorties', JSON.stringify(this.phrasesSorties));

    return phrase;
  }

  resetPhrasesSorties(): void {
    this.phrases = [...this.phrasesSorties, ...this.phrases];
    this.phrasesSorties = [];
    localStorage.removeItem('phrasesSorties');
  }
}
