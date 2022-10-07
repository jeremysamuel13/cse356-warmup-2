import { Schema, model, ObjectId } from 'mongoose';
import { TTTGrid, Winner } from '../ttt/interface'

interface IUserGame {
    user_id: ObjectId,
    start_date: Date,
    game_id: ObjectId
}

interface IRecord {
    _id: ObjectId,
    wins: number,
    losses: number,
    ties: number
}

interface IUser {
    _id: ObjectId,
    username: string,
    email: string,
    password: string,
    isVerified: boolean,
    verificationKey?: string
    games: Array<ObjectId>
}

interface IGame {
    _id: ObjectId,
    grid: TTTGrid,
    winner: Winner
    user_id: ObjectId
}

function verificationKeyIsRequired(this: IUser) {
    return !this.isVerified
}

const userSchema = new Schema<IUser>({
    _id: { type: Schema.Types.ObjectId, unique: true },
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
    _id: { type: Schema.Types.ObjectId },
    grid: { type: Object },
    winner: { type: Object },
    user_id: { type: Schema.Types.ObjectId }
})

export const User = model<IUser>('User', userSchema)