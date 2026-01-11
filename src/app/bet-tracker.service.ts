import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BetTrackerDto {
  id?: number;
  userId: number;
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
  roi: number;
  sportsbook: string;
  tipster: string;
}

export interface CreateBetTrackerDto {
  userId: number;
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
  profitMoney?: number;
  profitUnits?: number;
  sportsbook: string;
  tipster: string;
}

export interface UpdateBetTrackerDto {
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
  profitMoney?: number;
  profitUnits?: number;
  sportsbook: string;
  tipster: string;
}

export interface BetTrackerStatisticsDto {
  totalBets: number;
  totalProfit: number;
  winRate: number;
  totalROI: number;
  wins: number;
  losses: number;
  pushes: number;
  cashouts: number;
}

@Injectable({
  providedIn: 'root'
})
export class BetTrackerService {
  private apiUrl = 'https://localhost:7201/api/BetTrackers';

  constructor(private http: HttpClient) {}

  // Get all bets for a user
  getBetsByUserId(userId: number): Observable<BetTrackerDto[]> {
    return this.http.get<BetTrackerDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Get bet by ID
  getBetById(id: number): Observable<BetTrackerDto> {
    return this.http.get<BetTrackerDto>(`${this.apiUrl}/${id}`);
  }

  // Create new bet
  createBet(bet: CreateBetTrackerDto): Observable<BetTrackerDto> {
    return this.http.post<BetTrackerDto>(this.apiUrl, bet);
  }

  // Update bet
  updateBet(id: number, bet: UpdateBetTrackerDto): Observable<BetTrackerDto> {
    return this.http.put<BetTrackerDto>(`${this.apiUrl}/${id}`, bet);
  }

  // Delete bet
  deleteBet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get statistics
  getStatistics(userId: number): Observable<BetTrackerStatisticsDto> {
    return this.http.get<BetTrackerStatisticsDto>(`${this.apiUrl}/user/${userId}/statistics`);
  }

  // Get bets with pagination
  getBetsWithPagination(userId: number, pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  // Get bets by date range
  getBetsByDateRange(userId: number, startDate: string, endDate: string): Observable<BetTrackerDto[]> {
    return this.http.get<BetTrackerDto[]>(`${this.apiUrl}/user/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  // Get bets by sport
  getBetsBySport(userId: number, sport: string): Observable<BetTrackerDto[]> {
    return this.http.get<BetTrackerDto[]>(`${this.apiUrl}/user/${userId}/sport/${sport}`);
  }
}