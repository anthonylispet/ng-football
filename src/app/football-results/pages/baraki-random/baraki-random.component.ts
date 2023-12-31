import {Component, OnInit} from '@angular/core';
import {SentenceService} from "../../services/sentence.service";

@Component({
  selector: 'app-baraki-random',
  templateUrl: './baraki-random.component.html',
  styleUrls: ['./baraki-random.component.scss']
})
export class BarakiRandomComponent {

  phraseActuelle: string='';

  constructor(private phraseService:SentenceService) {
  }

  nouvellePhrase(): void {
    this.phraseActuelle = this.phraseService.getPhraseRandom();
  }

  get nbPhraseLeft() :number{
    return this.phraseService.phrases.length;
  }

  resetPhrases(): void {
    this.phraseService.resetPhrasesSorties();
    this.phraseActuelle='';
  }
}
