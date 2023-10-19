import { validationResult, matchedData } from 'express-validator';
import { Request, Response } from 'express';
import User from '../models/User';
import State from '../models/state';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const signin = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);

    // Validando e-mail
    const user = await User.findOne({email: data.email});
    if(!user) {
        res.json({ error: 'E-mail e/ou senha errador!'});
        return;
    }

    // Validando senha
    const match = await bcrypt.compare(data.password, user.passwordHash);
    if(!match) {
        res.json({ error: 'E-mail e/ou senha errador!'});
        return;
    }
    
    // Gerando um token para o usuário
    const payload = (Date.now() + Math.random().toString());
    const token = await bcrypt.hash(payload, 10);

    user.token = token;
    await user.save();

    res.json({token, email: data.email});
}

export const signup = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()})
        return;
    }
    const data = matchedData(req);
    
    // Verificando se e-mail já existe
    const user = await User.findOne({
        where:{ email: data.email }
    });
    if(user) {
        res.json({
            error:{email: {msg: 'E-mail já existe'}}
        });
        return;
    }

    // Verificando se o estado existe
    if(mongoose.Types.ObjectId.isValid(data.state)){
        const stateItem = await State.findById(data.state);
        if(!stateItem) {
            res.json({
                error: {state: { msg: 'Estado não existe '}}
            });
            return;
        }
    } else {
        res.json({
            error: {state: { msg: 'Código de estado inválido '}}
        });
        return;
    }

    // Encriptando  senha 
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Gerando um token para o usuário
    const payload = (Date.now() + Math.random().toString());
    const token = await bcrypt.hash(payload, 10);

    //Criando Usuário
     const newUser = new User({
        name: data.name,
        email: data.email,
        passwordHash,
        token,
        state: data.state
    })

    await newUser.save();

    res.json({token});
}