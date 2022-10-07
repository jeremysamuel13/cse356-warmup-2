import { ServerResponse } from '../interfaces'

export const PLAYER_CLIENT = 'X'
export const PLAYER_SERVER = 'O'
export const RESULT_TIE = 'T'
export const RESULT_NO_WINNER = ' '
export const EMPTY_ELEMENT = ' '

export type Players = typeof PLAYER_CLIENT | typeof PLAYER_SERVER
export type Winner = Players | typeof RESULT_TIE | typeof RESULT_NO_WINNER
export type TTTElement = Players | typeof EMPTY_ELEMENT

//Force size of array 
export type TTTGrid = [TTTElement, TTTElement, TTTElement, TTTElement, TTTElement, TTTElement, TTTElement, TTTElement, TTTElement]

export interface TTTRequest {
    grid: TTTGrid,

}

export interface TTTResponse extends ServerResponse {
    grid: TTTGrid,
    winner: Winner
}