import { Request, Response } from "express";
import Category from "../models/Category"
import mongoose,{ Schema, Document } from "mongoose";


export const getCategories = async (req: Request, res: Response) => {
    const cats = await Category.find();

    let categories: any[] = [];

    for(const cat of cats) {
        categories.push({
            ...cat.toObject(),
            img: `${process.env.BASE}/assets/images/${cat.slug}.png`
        });
    }

    res.json({categories});
}

export const addAction = async (req: Request, res: Response) => {
    
}

export const getList = async (req: Request, res: Response) => {
    
}

export const getItem = async (req: Request, res: Response) => {
    
}

export const editAction = async (req: Request, res: Response) => {
    
}