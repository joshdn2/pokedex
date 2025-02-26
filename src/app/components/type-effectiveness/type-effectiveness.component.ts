import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeEffectivenessService } from '../../services/type-effectiveness.service';

@Component({
  selector: 'app-type-effectiveness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-effectiveness.component.html',
  styleUrls: ['./type-effectiveness.component.css']
})
export class TypeEffectivenessComponent implements OnInit {
  @Input() types: string[] = [];
  @Input() name: string = '';
  effectiveness: { [key: string]: number } = {};
  loading = true;
  
  typeOrder = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  constructor(private typeEffectivenessService: TypeEffectivenessService) {}

  async ngOnInit() {
    if (this.types.length > 0) {
      this.effectiveness = await this.typeEffectivenessService.getTypeEffectiveness(this.types);
      console.log('Calculated effectiveness:', this.effectiveness);
    }
    this.loading = false;
  }

  getEffectivenessLabel(value: number): string {
    return this.typeEffectivenessService.getEffectivenessLabel(value);
  }

  getEffectivenessClass(value: number): string {
    if (value === 0) return 'immune';
    if (value === 0.25) return 'very-resistant';
    if (value === 0.5) return 'resistant';
    if (value === 2) return 'weak';
    if (value === 4) return 'very-weak';
    if (value === 1) return 'neutral';
    return '';
  }
}
