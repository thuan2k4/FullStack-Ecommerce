import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer


export async function connect() {
    mongoServer = await MongoMemoryServer.create({
        binary: { version: "10.2.1" }
    })
    const uri = mongoServer.getUri()

    await mongoose.connect(uri)
}

export async function clear() {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        await collections[key].deleteMany({})
    }
}


export async function close() {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    if (mongoServer) {
        await mongoServer.stop()
    }
}
