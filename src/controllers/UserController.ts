import { Request, Response } from "express";
import { validationResult, matchedData } from 'express-validator';
import mongoose from 'mongoose';
import State from '../models/state';
import User from "../models/User";
import Category from '../models/Category';
import Ad from '../models/Ad';
import bcrypt from 'bcrypt';
import state from "../models/state";
  
export const ping = (req: Request, res: Response) => {
    res.json({pong: true});
};

export const getStates = async (req: Request, res: Response) => {

    // Find para procurar todos os estados no banco de dados
    let states = await State.find({});
    res.json({results: states })
};

export const info = async (req: Request, res: Response) => {
    // Pegar token do corpo da requisição 
    let token = req.body.token;

    // Pegar infos do usuário utilizando o token como chave de busca no banco de dados
    const user = await User.findOne({token});
    const state = await State.findById(user?.state);
    const ads = await Ad.find({idUser: user?._id.toString()});

    // Preenchendo o array com os anúncios do usuário
    let adList: object[] = [];
    for(let i in ads) {

        const cat = await Category.findById(ads[i].category);
        adList.push({ ...ads[i], category: cat?.slug});
    }

    res.json({
        name: user?.name,
        email: user?.email,
        state: state?.name,
        adList
    });
};

export const editAction = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req)

    let updates: any = {};

    if(data.name) {
        updates.name = data.name;
    }

    if(data.email) {
        const emailCheck = await User.findOne({email: data.email});
        if(emailCheck) {
            res.json({error:'E-mail já existe'});
            return
        }
        updates.email = data.email;
    }

    console.log('código de Estado:', data.state);

    if(data.state) {
        if(mongoose.Types.ObjectId.isValid(data.state)){
            const stateCheck = await State.findById(data.state);
            if(!stateCheck) {
                res.json({error: 'Estado não existe'});
                return;
            }
            updates.state = data.state;
        } else {
            res.json({error: 'Código de estado inválido'});
            return;
        }
    }

    if(data.password) {
        updates.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await User.findOneAndUpdate({token: data.token}, {$set: updates});

    res.json({});      
};