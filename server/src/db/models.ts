import { Schema, model, ObjectId } from 'mongoose';
import { TTTGrid, Winner } from '../ttt/interface'


interface IUserGame {
    user_id: ObjectId,
    start_date: Date,
    game_id: ObjectId
}

export interface IUser {
    username: string,
    email: string,
    password: string,
    isVerified: boolean,
    verificationKey?: string
    games: Array<ObjectId>
}

interface IGame {
    grid: TTTGrid,
    winner: Winner
    user_game_id: ObjectId
}

function verificationKeyIsRequired(this: IUser) {
    return !this.isVerified
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
    verificationKey: { type: String, required: verificationKeyIsRequired },
    games: { type: [{ type: Schema.Types.ObjectId, ref: 'UserGame' }] }
});

const userGameSchema = new Schema<IUserGame>({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    start_date: { type: Date, required: true },
    game_id: { type: Schema.Types.ObjectId, required: true, ref: 'Game' }
})

const gameSchema = new Schema<IGame>({
    grid: { type: [{ type: String, enum: ['X', 'O', ' '] }], validate: (val: TTTGrid) => val.length < 9 },
    winner: { type: String, enum: ['X', 'O', 'T', ' '], default: ' ' },
    user_game_id: { type: Schema.Types.ObjectId, required: true, ref: 'UserGame' }
})

userSchema.methods.comparePassword = function (candidatePassword: string, callback: any) {
    callback(null, this.password === candidatePassword)
}


export const User = model<IUser>('User', userSchema)
export const UserGame = model<IUserGame>('UserGame', userGameSchema)
export const Game = model<IGame>('Game', gameSchema)