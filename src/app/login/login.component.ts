import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/login/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    // Xóa thông tin đăng nhập khỏi Local Storage khi truy cập trang đăng nhập
    localStorage.removeItem('loggedInUser');
  }

  login() {
    this.userService.getAllUsers().subscribe(
      (users) => {
        const user = users.find((u: any) => u.username === this.username && u.password === this.password);
        console.log('data',users)
        if (user) {
          const userData = {
            username: user.username,
            level: user.level
          };
          localStorage.setItem('loggedInUser', JSON.stringify(userData)); // Lưu trạng thái đăng nhập
          this.router.navigate(['/home']);
        }
        else if (this.username =='' || this.password ==''){
          Swal.fire({
            icon: 'error',
            title: 'Bạn phải điền đẩy đủ thông tin !!',
            text: "",
            confirmButtonText: 'Ok',
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Tài khoản hoặc mật khẩu không chính xác !!',
            text: "",
            confirmButtonText: 'Ok',
          });
        }
      },
      (error) => {
        console.error('Error fetching users', error);
        alert('An error occurred while trying to log in. Please try again later.');
      }
    );
  }
}
