import { Request, Response } from "express";
import Category from "../models/Category"
import User from '../models/User';
import Ad from '../models/Ad';
import State from '../models/state';
import mongoose,{ Schema, Document } from "mongoose";
import { timeLog } from "console";


export const getCategories = async (req: Request, res: Response) => {
    // Lista todas as categorias em array e dps ás exibe
    const cats = await Category.find();
    const categories: any[] = [];

    for(const cat of cats) {
        categories.push({
            ...cat.toObject(),
            img: `${process.env.BASE}/assets/images/${cat.slug}.jpg`
        });
    }

    res.json({results: categories});
}

export const addAction = async (req: Request, res: Response) => {
    let { title, price, priceneg, desc, cat, token } = req.body;
    const user = await User.findOne({token}).exec();
    
    // Pega as infos da req e faz as verificações para saber se os dados foram mandados
    if(!title || !cat) {
        res.json({error: 'Título e/ou categoria não foram preenchidos'});
        return;
    }
    
    if(cat.length < 12) {
        res.json({error: 'Categoria inexistente'});
        return;
    }

    const category = await Category.findById(cat);
    if(!category) {
        res.json({error: 'categoria Inexistente'});
        return;
    }

    if(price) { // Ex: R$ 8.000,35 = 8000.35
        price = price.replace('.', '').replace(',', '.').replace('R$', '');
        price = parseFloat(price);
    } else {
        price = 0;
    }

    // Cria um novo Ade salva no banco de dados
    const newAd = new Ad();
    newAd.status = 'true';
    newAd.idUser = user?._id.toString() || '';
    newAd.state = user?.state || '';
    newAd.dateCreated = new Date();
    newAd.title = title;
    newAd.category = cat;
    newAd.price = price;
    newAd.priceNegotiable = (priceneg == 'true') ? true : false;
    newAd.description = desc;
    newAd.views = 0;

    const info = await newAd.save();
    res.json({id: info._id});

}

export const getList = async (req: Request, res: Response) => {
    const { sort = 'asc', offset = 0, limit = 8, q, cat, state, views}  = req.query;
    const filters: any = { status: true};
    let total: number = 0;

    /* Pega as infos vindos da query e aplica os filtros */
    if(q) {
        filters.title = { $regex: q, $options: 'i'};
    }

    if(cat) {
        const c = await Category.findOne({slug: cat}).exec();
        if(c) {
            filters.category = c.id.toString();
        }
    }
    if(views) {
        const v = await Ad.findOne({views}).exec();
        if(v) {
            filters.views = v.id.toString();
        }
    }

    if(state) {
        const s = await State.findOne({ name: state.toString().toUpperCase() }).exec();
        if(s) {
            filters.state = s._id.toString();
        }
    }

    // Mesma busca com os filtros para saber quantos ads vão retornar
    const adsTotal = await Ad.find(filters).exec();
    total = adsTotal.length;

    // Busca os ads no banco já utilizando os filtros
    const adsData = await Ad.find(filters)
        .sort({dateCreated: (sort == 'desc' ?-1:1)})
        .skip(+offset)
        .limit(+limit)
        .exec();

    const ads: any[] = []

    for( const ad of adsData) {
        const stateData = await State.findById(ad.state).exec();
        ads.push({
            id: ad._id,
            title: ad.title,
            price: ad.price,
            priceNegotiable: ad.priceNegotiable,
            state: stateData ? stateData.name : null
        });
    };

    res.json({results: ads, total});

}

export const getItem = async (req: Request, res: Response) => {
    const { title, other = null} = req.query;

    // Recebe o id, verifica se é válido e adiciona 1 view no ad visualizado
    if(!title) {
        res.json({ error:'Sem produto'});
        return;
    }

    const ad = await Ad.findOne({ title });
    if(!ad) {
        res.json({error: 'Produto inexistente'});
        return;
    }

    ad.views++;
    await ad.save();

    // Busca as infos do ad utilizando os ids cadastrados nele mesmo
    const category = await Category.findById(ad.category).exec();
    const userInfo = await User.findById(ad.idUser).exec();
    const stateInfo = await State.findById(ad.state).exec();

    // Busca anúncios diferentes do mesmo anunciante(se houver) baseado no id contido no ad retornado
    const others: any = [];
    if(other) {
        const otherData = await Ad.find({status: true, idUser: ad.idUser}).exec();

        for(let i in otherData) {
            if(otherData[i]._id.toString() != ad._id.toString()) {

                others.push({
                    id: otherData[i]._id,
                    title: otherData[i].title,
                    price: otherData[i].price,
                    priceNegotiable: otherData[i].priceNegotiable
                });
            }
        }
    }

    res.json({
        title: ad.title,
        price: ad.price,
        priceNegotiable: ad.priceNegotiable,
        description: ad.description,
        dateCreated: ad.dateCreated,
        views: ad.views,
        category,
        userInfo: { 
            name: userInfo?.name,
            email: userInfo?.email
        },
        stateName: stateInfo?.name,
        others
    });
}

export const editAction = async (req: Request, res: Response) => {
    const { id } = req.params;
    let { title, status, price, priceng, desc, cat, token} = req.body;

    if(id.length < 12) {
        res.json({error: 'ID inválido'});
        return;
    }
    const ad = await Ad.findById(id).exec();

    if(!ad) {
        res.json({error: 'Anúncio não encontrado'});
        return;
    }

    const user = await User.findOne({ token }).exec();
    if(user?._id.toString() !== ad.idUser) {
        res.json({error: "Esta anúncio não pe seu"});
        return;
    }   

    const updates: any = {};

    if(title) {
        updates.title = title
    }
    if(price) { // Ex: R$ 8.000,35 = 8000.35
        price = price.replace('.', '').replace(',', '.').replace('R$', '');
        price = parseFloat(price);
        updates.price = price;
    }
    if(priceng) {
        updates.priceNegotiable = priceng;
    }
    if(status) {
        updates.status = status;
    }
    if(desc) {
        updates.description = desc;
    }
    if(cat) {
        const category = await Category.findOne({ slug: cat}).exec();
        if(!category) {
            res.json({error: 'Categoria Inexistente'});
            return;
        }
        updates.category = category._id.toString();
    }

    await Ad.findByIdAndUpdate(id, {$set: updates});

    res.json({error: ''});
}