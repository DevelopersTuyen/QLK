import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/login/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  newUser: any = { username: '', name: '', email: '', level: '', password: '' };
  searchKeyword: string = '';

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    //kiểm tra login
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      this.router.navigate(['/login']);
    }

    this.GetAllACount();
  }

  isLoggedIn(): boolean {
    // Đặt logic kiểm tra đăng nhập ở đây
    const loggedInUser = localStorage.getItem('loggedInUser');
    return !!loggedInUser; // Trả về true nếu đã đăng nhập, ngược lại false
  }

  //lấy tất cả danh sách tài khoản
  GetAllACount() {
    this.userService.getAllAccountNotAdmin().subscribe(
      (users) => {
        // Filter out users with level 1
        this.users = users.filter((u: any) => u.level !== 1);
        console.log('Filtered users:', this.users);

      },
      (error) => {
        console.error('Error fetching users', error);
        alert('An error occurred while trying to log in. Please try again later.');
      }
    );
  }

  selectUser(user: any): void {
    this.selectedUser = { ...user }; // Make a copy of the user object
  }

  saveChanges(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
        (response) => {
          console.log('User updated:', response);
          Swal.fire({
            icon: 'success',
            title: 'success',
            text: "Cập nhật thông tin thành công",
            confirmButtonText: 'Ok',
          });
          // Refresh the user list after update
          this.GetAllACount();
        },
        (error) => {
          console.error('Error updating user', error);
          alert('An error occurred while trying to update the user. Please try again later.');
        }
      );
    }
  }

  addNewUser(): void {
    this.userService.addUser(this.newUser).subscribe(
      (response) => {
        console.log('New user added:', response);
        Swal.fire({
          icon: 'success',
          title: 'success',
          text: "Thêm mới tài khoản thành công",
          confirmButtonText: 'Ok',
        });
        this.GetAllACount();
      },
      (error) => {
        console.error('Error adding new user', error);
        alert('An error occurred while trying to add the user. Please try again later.');
      }
    );
  }

  deleteUser(userId: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn chắc chắn?',
      text: 'Bạn có muốn xoá tài khoản này không?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe(
          (response) => {
            console.log('User deleted:', response);
            Swal.fire({
              icon: 'success',
              title: 'Thành công!',
              text: 'Tài khoản đã được xoá thành công.',
              confirmButtonText: 'OK'
            });
            this.GetAllACount(); // Reload users after deletion
          },
          (error) => {
            console.error('Error deleting user', error);
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi xoá tài khoản. Vui lòng thử lại sau.',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }

  searchUsers(): void {
    if (this.searchKeyword.trim() === '') {
      this.loadUsers(); // Reload all users if search field is empty
      return;
    }

    // Perform search based on username, name, and level
    this.userService.searchUsers(this.searchKeyword).subscribe(
      (results) => {
        this.users = results;
      },
      (error) => {
        console.error('Error searching users', error);
        alert('An error occurred while trying to search users. Please try again later.');
      }
    );
  }

  loadUsers(): void {
    this.userService.getAllAccountNotAdmin().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users', error);
        alert('An error occurred while trying to fetch users. Please try again later.');
      }
    );
  }

}
