import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit{

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
