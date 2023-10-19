import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const mongoConnect = async () => {
    try{   
        console.log("Conectando ao MongoDB...");
        await connect(process.env.DATABASE as string);
        console.log('MongoDB conectado');
        
    }catch(error){
        console.log('Erro Conexão MongoDB:', error);
    }
}