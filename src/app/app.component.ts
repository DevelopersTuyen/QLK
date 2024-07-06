import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './service/home/home.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'title';
  menus: any[] = [];
  loggedInUser: any; // Biến để lưu thông tin người dùng đăng nhập

  constructor(private router: Router, private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadMenus(); // Load menus khi component khởi tạo

    // Subscribe để xử lý sự kiện đăng xuất
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Nếu là sự kiện NavigationEnd (khi điều hướng hoàn tất), kiểm tra lại đăng nhập
        this.loadMenus();
        // Kiểm tra đăng nhập và lấy thông tin người dùng
        this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
      }
    });

  }

  loadMenus(): void {
    // Kiểm tra đăng nhập và load danh sách menu
    if (this.isLoggedIn()) {
      this.getMenu();
    } else {
      this.menus = []; // Nếu chưa đăng nhập, reset danh sách menu
    }
  }

  getMenu(): void {
    this.menuService.getAllMenu().subscribe(
      (menus) => {
        if (menus) {
          this.menus = menus;
          // console.log('Menus:', menus);
        } else {
          console.error('Failed to fetch menus');
          // Xử lý khi không lấy được danh sách menu
        }
      },
      (error) => {
        console.error('Error fetching menus', error);
        // Xử lý lỗi khi gọi API lấy danh sách menu
      }
    );
  }

  isLoggedIn(): boolean {
    // Kiểm tra xem có thông tin người dùng đã lưu trong localStorage hay không
    const loggedInUser = localStorage.getItem('loggedInUser');
    return !!loggedInUser; // Trả về true nếu đã đăng nhập, ngược lại false
  }

  logout(): void {
    // Xóa thông tin đăng nhập từ localStorage
    localStorage.removeItem('loggedInUser');
    // Sau khi đăng xuất, điều hướng đến trang login
    this.router.navigateByUrl('/login');
  }
}
