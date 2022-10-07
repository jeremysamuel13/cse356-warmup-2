import { connect, mongo } from 'mongoose'

export const initDB = async (username: string, password: string, host: string, port: number | string) => {
    console.log({ username, password, host, port })
    const mongoStr = `mongodb://${username}:${password}@${host}:${port}/?authMechanism=DEFAULT`
    return connect(mongoStr, (val) => console.log(val ?? "connected to ttt db"))
}

