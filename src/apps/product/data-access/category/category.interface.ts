
import {  Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { Types } from "mongoose";
export interface ICategory extends Document, Timestamps {
    _id: string;
    name: string; 
    description?: string; 
    parentId?: Types.ObjectId;  
}