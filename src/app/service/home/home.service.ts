// src/app/service/Menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiMenuUrl = 'http://localhost:3000/api/menu/get-all';

  constructor(private router: Router,private http: HttpClient) {}

  getAllMenu(): Observable<any[]> {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      this.router.navigate(['/login']); 
      return of([]); // Trả về mảng rỗng nếu chưa đăng nhập
    }

    const userData = JSON.parse(loggedInUser);
    const levelOfUser = userData.level; // Lấy tầng level từ người dùng đăng nhập

    return this.http.get<any[]>(this.apiMenuUrl).pipe(
      map(menus => {
        // Lọc menu theo id nếu levelOfUser là 1
        if (levelOfUser === 1) {
          return menus.filter(menu => menu.id === 1 || menu.id === 2|| menu.id === 3|| menu.id === 4|| menu.id === 5|| menu.id === 6|| menu.id === 7);
        }
        else if (levelOfUser === 2){
          return menus.filter(menu => menu.id === 2|| menu.id === 3|| menu.id === 7);
        }
        else if (levelOfUser === 3){
          return menus.filter(menu => menu.id === 5|| menu.id === 6);
        }
        return menus;
      }),
      catchError((error) => {
        console.error('Error fetching menus', error);
        alert('An error occurred while trying to fetch menu. Please try again later.');
        return of([]); // Trả về mảng rỗng nếu có lỗi
      })
    );

  }
}
