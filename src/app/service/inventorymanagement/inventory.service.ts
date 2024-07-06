import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = 'http://localhost:3000/api/warehouseInvetory';

  constructor(private http: HttpClient) {}

  getAllWarehouse(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all-warehouse`);
  }

  updateWarehouse(id: number, warehouse: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-warehouse/${id}`, warehouse);
  }

  updateWarehousehasProduct(id: number, warehouse: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-warehouse-and-product/${id}`, warehouse);
  }

  addWarehouse(newWarehouse: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-warehouse`, newWarehouse);
  }

  deleteWarehouse(warehouseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-warehouse/${warehouseId}`);
  }

  searchWarehouse(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search-warehouse?keyword=${keyword}`);
  }

  getWarehouseById(warehouseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getWarehouseById/${warehouseId}`);
  }

  addProducts(newProducts: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-products`, newProducts);
  }

  getAllProduct(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all-product`);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-product/${id}`, product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-product/${productId}`);
  }

  searchProduct(searchKeywordProduct: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search-product?keyword=${searchKeywordProduct}`);
  }

  updateProductAddWarehouse(id: number, product_code: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-product-add-warehouse/${id}`, product_code);
  }

  updateProductByWarehouse(id: number, warehouse_id: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-product-by-warehouse/${id}`, warehouse_id);
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getProductById/${productId}`);
  }
}
