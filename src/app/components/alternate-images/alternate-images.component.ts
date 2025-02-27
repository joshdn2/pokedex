import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonImage } from '../../services/interfaces/pokemon.interfaces';

@Component({
  selector: 'app-alternate-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alternate-images.component.html',
  styleUrls: ['./alternate-images.component.css']
})
export class AlternateImagesComponent {
  @Input() images: PokemonImage[] = [];
  @Input() selectedImage?: PokemonImage;
  @Output() imageSelected = new EventEmitter<PokemonImage>();

  selectImage(image: PokemonImage): void {
    this.selectedImage = image;
    this.imageSelected.emit(image);
  }

  trackByUrl(index: number, image: PokemonImage): string {
    return image.url;
  }
}
