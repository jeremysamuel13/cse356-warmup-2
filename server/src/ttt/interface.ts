import { ServerResponse } from '../interfaces'

export const PLAYER_CLIENT = 'X'
export const PLAYER_SERVER = 'O'
export const RESULT_TIE = 'T'
export const RESULT_NO_WINNER = ' '
export const EMPTY_ELEMENT = ' '

export type Players = typeof PLAYER_CLIENT | typeof PLAYER_SERVER
export type Winner = Players | typeof RESULT_TIE | typeof RESULT_NO_WINNER
export type TTTElement = Players | typeof EMPTY_ELEMENT
export type Move = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null

//Force size of array 
export type TTTGrid = [TTTElement, TTTElement, TTTElement, TTTElement, TTTElement, TTTElement, TTTElement, TTTElement, TTTElement]

export interface TTTRequest {
    move: Move
}

export interface TTTResponse extends ServerResponse {
    grid?: TTTGrid,
    winner?: Winner
}