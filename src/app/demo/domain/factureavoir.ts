import { Client } from "./client";
import { Product } from "./product";

export class FactureAvoir {
    id?:string;
    numfactureavoir?: number;
    client?: Client[];
    datefacture?: Date; 
    product?: Product[] = [];
    montanttc?: number;
    montantht?: number;
 
    

}
