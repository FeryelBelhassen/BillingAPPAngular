import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../domain/product';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable()
export class ProductService {
/*
  const API_URL = 'http://localhost:8080/api';
*/
  API_URL = environment.baseUrl+'api';

    constructor(private http: HttpClient) { }

    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }


  public getProducts(): Observable<any>{
    console.log('heloooo')
    return this.http.get<Product[]>(`${this.API_URL}/products`);
  }


  public createProduct(product: Product): Observable<any> {
    return this.http.post(`${this.API_URL}/addproduct`, product);
  }

  public updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.API_URL}/updateproduct/${id}`, product);
  }

  public deleteProduct(id: number) {
    return this.http.delete(`${this.API_URL}/deleteproduct/${id}`);
  }


    public getProduct(id: number): Observable<any> {
      return this.http.get(`${this.API_URL}/products/${id}`);
    }



}
