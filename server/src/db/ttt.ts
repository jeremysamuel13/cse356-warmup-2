import { User, Game, UserGame, } from "./models"

export const getUserFromUsername = async (username: string) => {
    return await User.findOne({ username })
}

export const getUserFromEmail = async (email: string) => {
    return await User.findOne({ email })
}

export const getGame = async (id) => {
    return await Game.findById(id)
}

export const putUser = async (username, email, password, key) => {
    const res = await User.create({
        username,
        email,
        password,
        games: [],
        verificationKey: key
    })
    return res
}