import { Schema, model, connection, Model } from 'mongoose';

export type UserType = {
    name: string,
    email: string,
    state: string,
    passwordHash: string,
    token: string
}

export const schema = new Schema<UserType>({
    name: String,
    email: String,
    state: String,
    passwordHash: String,
    token: String
});

const modelName: string = 'User';

export default (connection && connection.models[modelName]) ? 
    connection.models[modelName] as Model<UserType>: 
    model<UserType>(modelName, schema);