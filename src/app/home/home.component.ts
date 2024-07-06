import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    //kiểm tra login
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      this.router.navigate(['/login']); 
    }
   
  }

  isLoggedIn(): boolean {
    // Đặt logic kiểm tra đăng nhập ở đây
    const loggedInUser = localStorage.getItem('loggedInUser');
    return !!loggedInUser; // Trả về true nếu đã đăng nhập, ngược lại false
  }
}
