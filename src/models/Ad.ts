import { Schema, model, connection, Model } from 'mongoose';

type UserType = {
    idUser: string,
    state: string,
    category: string,
    images: [object],
    dateCreated: Date,
    title: string,
    price: number,
    priceNegotiable: boolean,
    description: string,
    views: number,
    status: string
}

const schema = new Schema<UserType>({
    idUser: String,
    state: String,
    category: String,
    images: [Object],
    dateCreated: Date,
    title: String,
    price: Number,
    priceNegotiable: Boolean,
    description: String,
    views: Number,
    status: String
});

const modelName: string = 'Ad';

export default (connection && connection.models[modelName]) ? 
    connection.models[modelName] as Model<UserType>: 
    model<UserType>(modelName, schema);