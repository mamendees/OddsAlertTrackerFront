import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import {
  BetTrackerService,
  BetTrackerDto,
  CreateBetTrackerDto,
  UpdateBetTrackerDto,
  BetTrackerStatisticsDto
} from '../bet-tracker.service';

interface Column {
  key: string;
  label: string;
  visible: boolean;
  width: number;
  minWidth: number;
  resizable: boolean;
  type: 'date' | 'text' | 'number' | 'long' | 'select' | 'calc' | 'action';
  canHide: boolean;
  options?: string[];
}

interface Bet {
  id?: number;
  date: string;
  sport: string;
  league: string;
  teamA: string;
  teamB: string;
  ml: string;
  market: string;
  line: string;
  team: string;
  matchBias: string;
  side: string;
  time: number;
  dragonsPro: number;
  dragonsAgainst: number;
  player: string;
  type: string;
  stake: number;
  odds: number;
  wl: string;
  profitMoney: number;
  profitUnits: number;
  roi: string;
  sportsbook: string;
  tipster: string;
  [key: string]: string | number | undefined;
}

interface NewBet {
  date: string;
  sport: string;
  league: string;
  teamA: string;
  teamB: string;
  ml: string;
  market: string;
  line: string;
  team: string;
  matchBias: string;
  side: string;
  time: number;
  dragonsPro: number;
  dragonsAgainst: number;
  player: string;
  type: string;
  stake: string;
  odds: string;
  wl: string;
  sportsbook: string;
  tipster: string;
  [key: string]: string | number;
}

@Component({
  selector: 'app-betting-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './betting-tracker.component.html',
  styleUrls: ['./betting-tracker.component.css']
})
export class BettingTrackerComponent implements OnInit {
  // State
  bets: Bet[] = [];
  editingIndex: number = -1;
  showSettings: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  statistics: BetTrackerStatisticsDto | null = null;
  userId: number | null = null;

  // New bet form
  newBet: NewBet = this.getEmptyNewBet();
  newBetProfitMoney: number | null = null;
  newBetProfitUnits: number | null = null;

  // Column configuration
  columns: Column[] = [
    { key: 'date', label: 'DATE', visible: true, width: 110, minWidth: 60, resizable: true, type: 'date', canHide: false },
    { key: 'sport', label: 'SPORT', visible: true, width: 90, minWidth: 70, resizable: true, type: 'select', options: ['', 'LOL', 'CSGO', 'DOTA', 'SOCCER'], canHide: true },
    { key: 'league', label: 'LEAGUE', visible: true, width: 100, minWidth: 80, resizable: true, type: 'select', options: ['', 'LPL', 'LCK', 'LCK CL', 'CBLOL', 'LCS', 'LEC'], canHide: true },
    { key: 'teamA', label: 'TEAM A', visible: true, width: 120, minWidth: 80, resizable: true, type: 'text', canHide: true },
    { key: 'teamB', label: 'TEAM B', visible: true, width: 120, minWidth: 80, resizable: true, type: 'text', canHide: true },
    { key: 'ml', label: 'ML (MAP)', visible: true, width: 80, minWidth: 50, resizable: true, type: 'select', options: ['', 'MATCH', 'TOURNAMENT', 'MAP 1', 'MAP 2', 'MAP 3', 'MAP 4', 'MAP 5', 'FIRST HALF', 'SECOND HALF'], canHide: true },
    { key: 'market', label: 'MARKET', visible: true, width: 100, minWidth: 90, resizable: true, type: 'select', options: ['', 'MONEY LINE', 'UNDER KILL', 'OVER KILL', 'UNDER TIME', 'OVER TIME', 'MAP HANDICAP', "KILL HANDICAP"], canHide: true },
    { key: 'line', label: 'LINE', visible: true, width: 80, minWidth: 60, resizable: true, type: 'text', canHide: true },
    { key: 'team', label: 'TEAM', visible: true, width: 120, minWidth: 60, resizable: true, type: 'text', canHide: true },
    { key: 'matchBias', label: 'MATCH BIAS', visible: true, width: 120, minWidth: 60, resizable: true, type: 'select', options: ['', 'HEAVY FAVORITE', 'FAVORITE', 'EVEN', 'UNDERDOG', 'HEAVY UNDERDOG'], canHide: true },
    { key: 'side', label: 'SIDE', visible: true, width: 90, minWidth: 60, resizable: true, type: 'select', options: ['', 'BLUE', 'RED', 'OVER', 'UNDER', 'HOME', 'AWAY'], canHide: true },
    { key: 'time', label: 'TIME (min)', visible: true, width: 90, minWidth: 60, resizable: true, type: 'long', canHide: true },
    { key: 'dragonsPro', label: 'DRAGONS PRO', visible: true, width: 110, minWidth: 120, resizable: true, type: 'long', canHide: true },
    { key: 'dragonsAgainst', label: 'DRAGONS AGAINST', visible: true, width: 130, minWidth: 150, resizable: true, type: 'long', canHide: true },
    { key: 'player', label: 'PLAYER', visible: true, width: 120, minWidth: 80, resizable: true, type: 'text', canHide: true },
    { key: 'type', label: 'TYPE', visible: true, width: 90, minWidth: 60, resizable: true, type: 'select', options: ['', 'PRE', 'LIVE'], canHide: true },
    { key: 'stake', label: 'STAKE', visible: true, width: 90, minWidth: 70, resizable: true, type: 'number', canHide: false },
    { key: 'odds', label: 'ODDS', visible: true, width: 90, minWidth: 60, resizable: true, type: 'number', canHide: false },
    { key: 'wl', label: 'W/L', visible: true, width: 70, minWidth: 50, resizable: true, type: 'select', options: ['', 'W', 'L', 'PUSH', 'CASHOUT'], canHide: false },
    { key: 'profitMoney', label: 'PROFIT $', visible: true, width: 90, minWidth: 85, resizable: true, type: 'calc', canHide: true },
    { key: 'profitUnits', label: 'PROFIT U', visible: true, width: 90, minWidth: 85, resizable: true, type: 'calc', canHide: true },
    { key: 'roi', label: 'ROI %', visible: true, width: 80, minWidth: 65, resizable: true, type: 'calc', canHide: true },
    { key: 'sportsbook', label: 'SPORTSBOOK', visible: true, width: 110, minWidth: 110, resizable: true, type: 'select', options: ['', 'PINNACLE', 'BET365', 'BLAZE', 'ESTRELA'], canHide: true },
    { key: 'tipster', label: 'TIPSTER', visible: true, width: 110, minWidth: 80, resizable: true, type: 'text', canHide: true },
    { key: 'action', label: 'ACTION', visible: true, width: 80, minWidth: 80, resizable: false, type: 'action', canHide: false }
  ];

  // Resize state
  private currentColumn: Column | null = null;
  private startX: number = 0;
  private startWidth: number = 0;
  private isResizing: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private betTrackerService: BetTrackerService
  ) {
    this.userId = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.loadColumnWidths();
    this.loadColumnVisibility();
    this.loadBetsFromAPI();
    this.loadStatistics();
  }

  // ===================
  // API Methods
  // ===================

  loadBetsFromAPI(): void {
    if (!this.userId) {
      this.errorMessage = 'User not logged in';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.betTrackerService.getBetsByUserId(this.userId).subscribe({
      next: (data: BetTrackerDto[]) => {
        this.bets = data.map(dto => this.mapDtoToBet(dto));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading bets:', error);
        this.errorMessage = 'Failed to load bets';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStatistics(): void {
    if (!this.userId) return;

    this.betTrackerService.getStatistics(this.userId).subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  addBet(): void {
    if (!this.userId) {
      alert('User not logged in');
      return;
    }

    const stake = parseFloat(this.newBet.stake);
    const odds = parseFloat(this.newBet.odds);
    const wl = this.newBet.wl;

    if (!stake || !odds || !wl) {
      alert('Please fill in at least STAKE, ODDS, and W/L');
      return;
    }

    const createDto: CreateBetTrackerDto = {
      userId: this.userId,
      date: this.newBet.date || new Date().toISOString().split('T')[0],
      sport: this.newBet.sport,
      league: this.newBet.league,
      teamA: this.newBet.teamA,
      teamB: this.newBet.teamB,
      ml: this.newBet.ml,
      market: this.newBet.market,
      line: this.newBet.line,
      team: this.newBet.team,
      matchBias: this.newBet.matchBias || '',
      side: this.newBet.side,
      time: Math.abs(Math.round(Number(this.newBet.time) || 0)),
      dragonsPro: Math.abs(Math.round(Number(this.newBet.dragonsPro) || 0)),
      dragonsAgainst: Math.abs(Math.round(Number(this.newBet.dragonsAgainst) || 0)),
      player: this.newBet.player,
      type: this.newBet.type,
      stake: stake,
      odds: odds,
      wl: wl,
      sportsbook: this.newBet.sportsbook,
      tipster: this.newBet.tipster
    };

    // For cashout, add manual profit values
    if (wl === 'CASHOUT') {
      if (this.newBetProfitMoney === null || this.newBetProfitMoney === undefined) {
        alert('Please enter Profit $ or Profit U for CASHOUT bets');
        return;
      }
      createDto.profitMoney = this.newBetProfitMoney;
      createDto.profitUnits = this.newBetProfitUnits ?? 0;
    }

    this.isLoading = true;

    this.betTrackerService.createBet(createDto).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.bets.unshift(this.mapDtoToBet(response));
        this.loadStatistics();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating bet:', error);
        const errorMsg = error.error?.title || error.error || 'Unknown error';
        alert('Failed to create bet: ' + errorMsg);
        this.cdr.detectChanges();
      }
    });
  }

  deleteBet(index: number): void {
    if (!confirm('Are you sure you want to delete this bet?')) return;

    const bet = this.bets[index];
    if (!bet.id) {
      alert('Cannot delete bet without ID');
      return;
    }

    this.isLoading = true;

    this.betTrackerService.deleteBet(bet.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.bets.splice(index, 1);
        this.editingIndex = -1;
        this.loadStatistics();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error deleting bet:', error);
        alert('Failed to delete bet');
        this.cdr.detectChanges();
      }
    });
  }

  saveBet(index: number): void {
    const bet = this.bets[index];
    if (!bet.id) {
      alert('Cannot update bet without ID');
      return;
    }

    const updateDto: UpdateBetTrackerDto = {
      date: bet.date,
      sport: bet.sport,
      league: bet.league,
      teamA: bet.teamA,
      teamB: bet.teamB,
      ml: bet.ml,
      market: bet.market,
      line: bet.line,
      team: bet.team,
      matchBias: bet.matchBias,
      side: bet.side,
      time: Math.abs(Math.round(Number(bet.time) || 0)),
      dragonsPro: Math.abs(Math.round(Number(bet.dragonsPro) || 0)),
      dragonsAgainst: Math.abs(Math.round(Number(bet.dragonsAgainst) || 0)),
      player: bet.player,
      type: bet.type,
      stake: Number(bet.stake),
      odds: Number(bet.odds),
      wl: bet.wl,
      sportsbook: bet.sportsbook,
      tipster: bet.tipster
    };

    // For cashout, add manual profit values
    if (bet.wl === 'CASHOUT') {
      updateDto.profitMoney = Number(bet.profitMoney);
      updateDto.profitUnits = Number(bet.profitUnits);
    }

    this.isLoading = true;

    this.betTrackerService.updateBet(bet.id, updateDto).subscribe({
      next: (response) => {
        const updatedBet = this.mapDtoToBet(response);
        Object.assign(this.bets[index], updatedBet);

        this.editingIndex = -1;
        this.loadStatistics();
        this.isLoading = false;

        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error updating bet:', error);

        // Check if it's a validation error with multiple messages
        if (error.error?.errors) {
          const errorMessages: string[] = [];

          // Loop through each field's errors
          for (const field in error.error.errors) {
            const fieldErrors = error.error.errors[field];
            errorMessages.push(`${field}: ${fieldErrors.join(', ')}`);
          }

          alert('Validation failed:\n' + errorMessages.join('\n'));
        } else {
          // Single error message
          const errorMsg = error.error?.title || error.message || 'Unknown error';
          alert('Failed to update bet: ' + errorMsg);
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ===================
  // Data Mapping
  // ===================

  private mapDtoToBet(dto: BetTrackerDto): Bet {
    return {
      id: dto.id,
      date: dto.date.split('T')[0],
      sport: dto.sport || '',
      league: dto.league || '',
      teamA: dto.teamA || '',
      teamB: dto.teamB || '',
      ml: dto.ml || '',
      market: dto.market || '',
      line: dto.line || '',
      team: dto.team || '',
      matchBias: dto.matchBias || '',
      side: dto.side || '',
      time: dto.time || 0,
      dragonsPro: dto.dragonsPro || 0,
      dragonsAgainst: dto.dragonsAgainst || 0,
      player: dto.player || '',
      type: dto.type || '',
      stake: dto.stake,
      odds: dto.odds,
      wl: dto.wl,
      profitMoney: dto.profitMoney,
      profitUnits: dto.profitUnits,
      roi: Number(dto.roi).toFixed(1),
      sportsbook: dto.sportsbook || '',
      tipster: dto.tipster || ''
    };
  }

  // ===================
  // Statistics Getters
  // ===================

  get totalBets(): number {
    return this.statistics?.totalBets || this.bets.length;
  }

  get totalProfit(): string {
    const total = this.statistics?.totalProfit || this.bets.reduce((sum, b) => sum + b.profitMoney, 0);
    return this.formatCurrency(total);
  }

  get winRate(): string {
    const rate = this.statistics?.winRate || 0;
    return rate.toFixed(1) + '%';
  }

  get totalROI(): string {
    const roi = this.statistics?.totalROI || 0;
    return roi.toFixed(1) + '%';
  }

  // ===================
  // New Bet Calculations
  // ===================

  get newBetCalculatedProfitMoney(): string {
    if (this.newBet.wl === 'CASHOUT') {
      return this.newBetProfitMoney !== null ? this.formatCurrency(this.newBetProfitMoney) : '-';
    }

    const stake = parseFloat(this.newBet.stake);
    const odds = parseFloat(this.newBet.odds);
    const wl = this.newBet.wl;

    if (stake && odds && wl) {
      const profit = this.calculateProfit(stake, odds, wl);
      return this.formatCurrency(profit);
    }

    return '-';
  }

  get newBetCalculatedProfitUnits(): string {
    if (this.newBet.wl === 'CASHOUT') {
      return this.newBetProfitUnits !== null ? this.newBetProfitUnits.toFixed(2) + 'U' : '-';
    }

    const stake = parseFloat(this.newBet.stake);
    const odds = parseFloat(this.newBet.odds);
    const wl = this.newBet.wl;

    if (stake && odds && wl) {
      const profit = this.calculateProfit(stake, odds, wl);
      const units = profit / stake;
      return units.toFixed(2) + 'U';
    }

    return '-';
  }

  get newBetCalculatedROI(): string {
    if (this.newBet.wl === 'CASHOUT') {
      const stake = parseFloat(this.newBet.stake);
      if (stake && this.newBetProfitMoney !== null) {
        const roi = ((this.newBetProfitMoney / stake) * 100).toFixed(1);
        return roi + '%';
      }
      return '-';
    }

    const stake = parseFloat(this.newBet.stake);
    const odds = parseFloat(this.newBet.odds);
    const wl = this.newBet.wl;

    if (stake && odds && wl) {
      const profit = this.calculateProfit(stake, odds, wl);
      const roi = ((profit / stake) * 100).toFixed(1);
      return roi + '%';
    }

    return '-';
  }

  // ===================
  // Event Handlers
  // ===================

  toggleEdit(index: number): void {
    if (this.editingIndex === index) {
      this.saveBet(index);
    } else {
      this.editingIndex = index;
    }
  }

  onNewBetWLChange(): void {
    if (this.newBet.wl !== 'CASHOUT') {
      this.newBetProfitMoney = null;
      this.newBetProfitUnits = null;
    }
  }

  onNewBetProfitMoneyChange(): void {
    const stake = parseFloat(this.newBet.stake);
    if (this.newBet.wl === 'CASHOUT' && stake > 0 && this.newBetProfitMoney !== null) {
      this.newBetProfitUnits = this.newBetProfitMoney / stake;
    }
  }

  onNewBetProfitUnitsChange(): void {
    const stake = parseFloat(this.newBet.stake);
    if (this.newBet.wl === 'CASHOUT' && stake > 0 && this.newBetProfitUnits !== null) {
      this.newBetProfitMoney = this.newBetProfitUnits * stake;
    }
  }

  onProfitMoneyChange(bet: Bet): void {
    if (bet.wl === 'CASHOUT' && bet.stake > 0) {
      bet.profitUnits = bet.profitMoney / bet.stake;
      bet.roi = ((bet.profitMoney / bet.stake) * 100).toFixed(1);
    }
  }

  onProfitUnitsChange(bet: Bet): void {
    if (bet.wl === 'CASHOUT' && bet.stake > 0) {
      bet.profitMoney = bet.profitUnits * bet.stake;
      bet.roi = ((bet.profitMoney / bet.stake) * 100).toFixed(1);
    }
  }

  onWLChange(bet: Bet): void {
    if (bet.wl !== 'CASHOUT') {
      bet.profitMoney = this.calculateProfit(bet.stake, bet.odds, bet.wl);
      bet.profitUnits = bet.stake > 0 ? bet.profitMoney / bet.stake : 0;
      bet.roi = bet.stake > 0 ? ((bet.profitMoney / bet.stake) * 100).toFixed(1) : '0.0';
    }
  }

  // ===================
  // Column Management
  // ===================

  toggleColumnSettings(): void {
    this.showSettings = !this.showSettings;
  }

  toggleColumnVisibility(index: number): void {
    this.columns[index].visible = !this.columns[index].visible;
    this.saveColumnVisibility();
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
      // Enforce minimum width
      if (newWidth >= this.currentColumn.minWidth) {
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

  // ===================
  // Utility Methods
  // ===================

  calculateProfit(stake: number, odds: number, wl: string): number {
    if (wl === 'W') {
      return stake * (odds - 1);
    } else if (wl === 'L') {
      return -stake;
    }
    return 0;
  }

  formatCurrency(value: number): string {
    return '$' + value.toFixed(2);
  }

  getCellValue(bet: Bet, column: Column): string {
    const value = bet[column.key as keyof Bet];
    if (column.key === 'profitMoney') return this.formatCurrency(bet.profitMoney);
    if (column.key === 'profitUnits') return bet.profitUnits.toFixed(2) + 'U';
    if (column.key === 'roi') return bet.roi + '%';
    return value?.toString() || '';
  }

  getCellClass(bet: Bet, column: Column): string {
    let classes = `col-${column.key}`;
    if (!column.visible) classes += ' hidden';
    if (column.type === 'calc') {
      if (bet.wl === 'W' || (bet.wl === 'CASHOUT' && bet.profitMoney > 0)) classes += ' win';
      if (bet.wl === 'L' || (bet.wl === 'CASHOUT' && bet.profitMoney < 0)) classes += ' loss';
    }
    return classes;
  }

  isEditing(index: number): boolean {
    return this.editingIndex === index;
  }

  isCashout(bet: Bet): boolean {
    return bet.wl === 'CASHOUT';
  }

  isNewBetCashout(): boolean {
    return this.newBet.wl === 'CASHOUT';
  }

  isPositiveValue(value: string | number): boolean {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num > 0;
  }

  isNegativeValue(value: string | number): boolean {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num < 0;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Simple integer input handler: negative → absolute, decimal → round, invalid → 0
  onIntegerInput(event: any, targetObj: any, field: string): void {
    const value = event.target.value;
    const num = Number(value);

    // If not a valid number, ignore (don't change anything)
    if (isNaN(num)) {
      return;
    }

    // Apply: absolute value + round
    const result = Math.abs(Math.round(num));
    targetObj[field] = result;
    event.target.value = result;
  }

  // ===================
  // Local Storage
  // ===================

  private saveColumnWidths(): void {
    const widths: { [key: string]: number } = {};
    this.columns.forEach(col => {
      widths[col.key] = col.width;
    });
    localStorage.setItem('bettingTrackerColumnWidths', JSON.stringify(widths));
  }

  private loadColumnWidths(): void {
    const saved = localStorage.getItem('bettingTrackerColumnWidths');
    if (saved) {
      const widths = JSON.parse(saved);
      this.columns.forEach(col => {
        if (widths[col.key]) {
          // Ensure loaded width respects minimum width
          col.width = Math.max(widths[col.key], col.minWidth);
        }
      });
    }
  }

  private saveColumnVisibility(): void {
    const visibility: { [key: string]: boolean } = {};
    this.columns.forEach(col => {
      visibility[col.key] = col.visible;
    });
    localStorage.setItem('bettingTrackerColumnVisibility', JSON.stringify(visibility));
  }

  private loadColumnVisibility(): void {
    const saved = localStorage.getItem('bettingTrackerColumnVisibility');
    if (saved) {
      const visibility = JSON.parse(saved);
      this.columns.forEach(col => {
        if (visibility[col.key] !== undefined) {
          col.visible = visibility[col.key];
        }
      });
    }
  }

  // Modal state
  showModal: boolean = false;
  modalColumnKey: string = '';
  newOptionValue: string = '';

  onSelectChange(event: Event, colKey: string, target: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    if (value === '__ADD_NEW__') {
      this.openAddModal(colKey);
      // Força o select a voltar para o valor anterior IMEDIATAMENTE
      selectElement.value = target[colKey] || '';
      event.preventDefault();
      event.stopPropagation();
    } else {
      target[colKey] = value;
      console.log('colKey', colKey)
      // Trigger change events
      if (colKey === 'wl') {
        if (target === this.newBet) {
          this.onNewBetWLChange();
        } else {
          this.onWLChange(target);
        }
      }
    }
  }

  openAddModal(columnKey: string): void {
    this.modalColumnKey = columnKey;
    this.newOptionValue = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalColumnKey = '';
    this.newOptionValue = '';
  }

  addNewOption(): void {
    if (!this.newOptionValue.trim()) {
      alert('Please enter a value');
      return;
    }

    const column = this.columns.find(col => col.key === this.modalColumnKey);
    if (column && column.options) {
      const newValue = this.newOptionValue.trim().toUpperCase();

      // Check if value already exists
      if (column.options.includes(newValue)) {
        alert('This option already exists');
        return;
      }

      // Add new option to the array
      column.options.push(newValue);

      // TODO: Call API to save the new option
      // this.betTrackerService.addColumnOption(this.modalColumnKey, newValue).subscribe(...)
    }

    this.closeModal();
  }

  // ===================
  // Form Helpers
  // ===================

  private getEmptyNewBet(): NewBet {
    return {
      date: new Date().toISOString().split('T')[0],
      sport: '',
      league: '',
      teamA: '',
      teamB: '',
      ml: '',
      market: '',
      line: '',
      team: '',
      matchBias: '',
      side: '',
      time: 0,
      dragonsPro: 0,
      dragonsAgainst: 0,
      player: '',
      type: '',
      stake: '',
      odds: '',
      wl: '',
      sportsbook: '',
      tipster: ''
    };
  }
}