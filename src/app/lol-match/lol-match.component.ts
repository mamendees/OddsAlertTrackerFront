import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Column {
  key: string;
  label: string;
  visible: boolean;
  width: number;
  resizable: boolean;
  type: string;
  canHide: boolean;
}

interface Match {
  date: string;
  teamA: string;
  topA: string;
  jgA: string;
  midA: string;
  adcA: string;
  supA: string;
  teamB: string;
  topB: string;
  jgB: string;
  midB: string;
  adcB: string;
  supB: string;
  fTower: string;
  fDrake: string;
  fArauto: string;
  fBaron: string;
  numbersTowers: string;
  fb: string;
  duration: string;
  larvasA: string;
  larvasB: string;
  drakesA: string[];
  drakesB: string[];
  baronsA: string;
  baronsB: string;
  towersA: string;
  towersB: string;
  inibidorA: string;
  inibidorB: string;
  [key: string]: string | string[];
}

interface NewMatch {
  date: string;
  teamA: string;
  topA: string;
  jgA: string;
  midA: string;
  adcA: string;
  supA: string;
  teamB: string;
  topB: string;
  jgB: string;
  midB: string;
  adcB: string;
  supB: string;
  fTower: string;
  fDrake: string;
  fArauto: string;
  fBaron: string;
  numbersTowers: string;
  fb: string;
  duration: string;
  larvasA: string;
  larvasB: string;
  drakesA: string[];
  drakesB: string[];
  baronsA: string;
  baronsB: string;
  towersA: string;
  towersB: string;
  inibidorA: string;
  inibidorB: string;
  [key: string]: string | string[];
}

@Component({
  selector: 'app-lol-match',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lol-match.component.html',
  styleUrls: ['./lol-match.component.css']
})
export class LolMatchComponent implements OnInit {
  matches: Match[] = [];
  editingIndex: number = -1;
  showSettings: boolean = false;

  newMatch: NewMatch = {
    date: new Date().toISOString().split('T')[0],
    teamA: '',
    topA: '',
    jgA: '',
    midA: '',
    adcA: '',
    supA: '',
    teamB: '',
    topB: '',
    jgB: '',
    midB: '',
    adcB: '',
    supB: '',
    fTower: '',
    fDrake: '',
    fArauto: '',
    fBaron: '',
    numbersTowers: '',
    fb: '',
    duration: '',
    larvasA: '',
    larvasB: '',
    drakesA: [],
    drakesB: [],
    baronsA: '',
    baronsB: '',
    towersA: '',
    towersB: '',
    inibidorA: '',
    inibidorB: ''
  };

  drakeTypes: string[] = ['Chemtech', 'Cloud', 'Hextech', 'Infernal', 'Mountain', 'Ocean', 'Ancient'];
  
  drakeAbbreviations: { [key: string]: string } = {
    'Chemtech': 'Ch',
    'Cloud': 'Cl',
    'Hextech': 'He',
    'Infernal': 'In',
    'Mountain': 'Mo',
    'Ocean': 'Oc',
    'Ancient': 'An'
  };

  columns: Column[] = [
    { key: 'rowNumber', label: '#', visible: true, width: 40, resizable: false, type: 'rowNumber', canHide: false },
    { key: 'date', label: 'DATE', visible: true, width: 110, resizable: true, type: 'date', canHide: false },
    { key: 'teamA', label: 'TEAM A', visible: true, width: 120, resizable: true, type: 'text', canHide: false },
    { key: 'topA', label: 'TOP A', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'jgA', label: 'JG A', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'midA', label: 'MID A', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'adcA', label: 'ADC A', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'supA', label: 'SUP A', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'teamB', label: 'TEAM B', visible: true, width: 120, resizable: true, type: 'text', canHide: false },
    { key: 'topB', label: 'TOP B', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'jgB', label: 'JG B', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'midB', label: 'MID B', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'adcB', label: 'ADC B', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'supB', label: 'SUP B', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'fTower', label: 'F TOWER', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'fDrake', label: 'F DRAKE', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'fArauto', label: 'F ARAUTO', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'fBaron', label: 'F BARON', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'numbersTowers', label: 'NUMBERS TOWERS', visible: true, width: 150, resizable: true, type: 'text', canHide: false },
    { key: 'fb', label: 'FB', visible: true, width: 80, resizable: true, type: 'text', canHide: false },
    { key: 'duration', label: 'DURATION', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'larvasA', label: 'LARVAS A', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'larvasB', label: 'LARVAS B', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'drakesA', label: 'DRAKES A', visible: true, width: 200, resizable: true, type: 'drakeArray', canHide: false },
    { key: 'drakesB', label: 'DRAKES B', visible: true, width: 200, resizable: true, type: 'drakeArray', canHide: false },
    { key: 'baronsA', label: 'BARONS A', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'baronsB', label: 'BARONS B', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'towersA', label: 'TOWERS A', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'towersB', label: 'TOWERS B', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'inibidorA', label: 'INIBIDOR A', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'inibidorB', label: 'INIBIDOR B', visible: true, width: 100, resizable: true, type: 'text', canHide: false },
    { key: 'action', label: 'ACTION', visible: true, width: 80, resizable: false, type: 'action', canHide: false }
  ];

  // Resize variables
  currentColumn: Column | null = null;
  startX: number = 0;
  startWidth: number = 0;
  isResizing: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadData();
    this.loadColumnWidths();
  }

  get totalMatches(): number {
    return this.matches.length;
  }

  toggleColumnSettings(): void {
    this.showSettings = !this.showSettings;
  }

  startResize(event: MouseEvent, column: Column): void {
    if (!column.resizable) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    this.currentColumn = column;
    this.startX = event.pageX;
    this.startWidth = column.width;
    this.isResizing = true;

    this.renderer.setStyle(document.body, 'cursor', 'col-resize');
    this.renderer.setStyle(document.body, 'user-select', 'none');

    const unlistenMove = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      if (!this.currentColumn) return;
      e.preventDefault();
      const diff = e.pageX - this.startX;
      const newWidth = this.startWidth + diff;
      if (newWidth > 50) {
        this.currentColumn.width = newWidth;
        this.cdr.detectChanges();
      }
    });

    const unlistenUp = this.renderer.listen('document', 'mouseup', () => {
      this.isResizing = false;
      this.renderer.removeStyle(document.body, 'cursor');
      this.renderer.removeStyle(document.body, 'user-select');
      
      if (this.currentColumn) {
        this.saveColumnWidths();
      }
      this.currentColumn = null;
      
      unlistenMove();
      unlistenUp();
    });
  }

  addMatch(): void {
    const match: Match = {
      date: this.newMatch.date || '',
      teamA: this.newMatch.teamA,
      topA: this.newMatch.topA,
      jgA: this.newMatch.jgA,
      midA: this.newMatch.midA,
      adcA: this.newMatch.adcA,
      supA: this.newMatch.supA,
      teamB: this.newMatch.teamB,
      topB: this.newMatch.topB,
      jgB: this.newMatch.jgB,
      midB: this.newMatch.midB,
      adcB: this.newMatch.adcB,
      supB: this.newMatch.supB,
      fTower: this.newMatch.fTower,
      fDrake: this.newMatch.fDrake,
      fArauto: this.newMatch.fArauto,
      fBaron: this.newMatch.fBaron,
      numbersTowers: this.newMatch.numbersTowers,
      fb: this.newMatch.fb,
      duration: this.newMatch.duration,
      larvasA: this.newMatch.larvasA,
      larvasB: this.newMatch.larvasB,
      drakesA: [...this.newMatch.drakesA],
      drakesB: [...this.newMatch.drakesB],
      baronsA: this.newMatch.baronsA,
      baronsB: this.newMatch.baronsB,
      towersA: this.newMatch.towersA,
      towersB: this.newMatch.towersB,
      inibidorA: this.newMatch.inibidorA,
      inibidorB: this.newMatch.inibidorB
    };

    this.matches.unshift(match);
    this.saveData();
  }

  addDrake(team: 'A' | 'B', isNew: boolean = false, index?: number): void {
    if (isNew) {
      if (team === 'A') {
        this.newMatch.drakesA.push('');
      } else {
        this.newMatch.drakesB.push('');
      }
    } else if (index !== undefined) {
      if (team === 'A') {
        this.matches[index].drakesA.push('');
      } else {
        this.matches[index].drakesB.push('');
      }
    }
  }

  getDrakesDisplay(drakes: string[]): string {
    return drakes.filter(d => d).join(', ') || '-';
  }

  toggleDrake(team: 'A' | 'B', drakeType: string, isNew: boolean = false, matchIndex?: number): void {
    let drakes: string[];
    
    if (isNew) {
      drakes = team === 'A' ? this.newMatch.drakesA : this.newMatch.drakesB;
    } else if (matchIndex !== undefined) {
      drakes = team === 'A' ? this.matches[matchIndex].drakesA : this.matches[matchIndex].drakesB;
    } else {
      return;
    }

    // Add the drake type (allowing duplicates)
    drakes.push(drakeType);
  }

  removeDrake(team: 'A' | 'B', drakeType: string, isNew: boolean = false, matchIndex?: number): void {
    let drakes: string[];
    
    if (isNew) {
      drakes = team === 'A' ? this.newMatch.drakesA : this.newMatch.drakesB;
    } else if (matchIndex !== undefined) {
      drakes = team === 'A' ? this.matches[matchIndex].drakesA : this.matches[matchIndex].drakesB;
    } else {
      return;
    }

    // Remove the last occurrence of this drake type
    const index = drakes.lastIndexOf(drakeType);
    if (index > -1) {
      drakes.splice(index, 1);
    }
  }

  hasDrake(team: 'A' | 'B', drakeType: string, isNew: boolean = false, matchIndex?: number): boolean {
    let drakes: string[];
    
    if (isNew) {
      drakes = team === 'A' ? this.newMatch.drakesA : this.newMatch.drakesB;
    } else if (matchIndex !== undefined) {
      drakes = team === 'A' ? this.matches[matchIndex].drakesA : this.matches[matchIndex].drakesB;
    } else {
      return false;
    }

    return drakes.includes(drakeType);
  }

  getDrakeCount(team: 'A' | 'B', drakeType: string, isNew: boolean = false, matchIndex?: number): number {
    let drakes: string[];
    
    if (isNew) {
      drakes = team === 'A' ? this.newMatch.drakesA : this.newMatch.drakesB;
    } else if (matchIndex !== undefined) {
      drakes = team === 'A' ? this.matches[matchIndex].drakesA : this.matches[matchIndex].drakesB;
    } else {
      return 0;
    }

    return drakes.filter(d => d === drakeType).length;
  }

  getDrakeBadges(drakes: string[]): string {
    if (drakes.length === 0) return '-';
    
    const counts: { [key: string]: number } = {};
    drakes.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([drake, count]) => {
        const abbr = this.drakeAbbreviations[drake] || '';
        return count > 1 ? `${abbr}(${count})` : abbr;
      })
      .join(' ');
  }

  deleteMatch(index: number): void {
    if (confirm('Are you sure you want to delete this match?')) {
      this.matches.splice(index, 1);
      this.editingIndex = -1;
      this.saveData();
    }
  }

  toggleEdit(index: number): void {
    if (this.editingIndex === index) {
      this.saveMatch(index);
    } else {
      this.editingIndex = index;
    }
  }

  saveMatch(index: number): void {
    this.editingIndex = -1;
    this.saveData();
  }

  getCellClass(match: Match, column: Column): string {
    let classes = `col-${column.key}`;
    if (!column.visible) classes += ' hidden';
    return classes;
  }

  isEditing(index: number): boolean {
    return this.editingIndex === index;
  }

  saveData(): void {
    localStorage.setItem('lolMatchData', JSON.stringify(this.matches));
  }

  loadData(): void {
    const saved = localStorage.getItem('lolMatchData');
    if (saved) {
      this.matches = JSON.parse(saved);
    }
  }

  saveColumnWidths(): void {
    const widths: { [key: string]: number } = {};
    this.columns.forEach(col => {
      widths[col.key] = col.width;
    });
    localStorage.setItem('lolMatchColumnWidths', JSON.stringify(widths));
  }

  loadColumnWidths(): void {
    const saved = localStorage.getItem('lolMatchColumnWidths');
    if (saved) {
      const widths = JSON.parse(saved);
      this.columns.forEach(col => {
        if (widths[col.key]) {
          col.width = widths[col.key];
        }
      });
    }
  }

  getColumnStyle(column: Column): { [key: string]: string } {
    return { width: column.width + 'px' };
  }

  trackByIndex(index: number): number {
    return index;
  }
}