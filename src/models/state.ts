import { Schema, model, connection, Model } from 'mongoose';

type UserType = { name: string };

const schema = new Schema<UserType>({ name: String });

const modelName: string = 'State';

export default (connection && connection.models[modelName]) ? 
    connection.models[modelName] as Model<UserType>: 
    model<UserType>(modelName, schema);