import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../service/inventorymanagement/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {
  warehouses: any[] = [];
  selectedWarehouses: any = null;
  selectedWarehouseIds: number[] = []; //form sửa sản phẩm, hiển thị các sản phẩm thuộc kho.
  selectedProductIds: number[] = []; //form sửa kho, hiển thị các sản phẩm trong kho.
  newWarehouse: any = { name: '', location: '', capacity: '',product_code: '',created_by: '' };
  newProducts: any = { name: '',description: '',import_price: '',selling_price: '',category: '',warehouse_id: '' ,created_by: '' };
  searchKeyword: string = '';
  loginInUser: any;
  selectedProductToWarehouses: string[] = []; // Mảng lưu trữ id các kho đã chọn để
  selectedAddProductToWarehouses: string[] = []; // Form thêm mới khi , chon product vào kho
  products: any[] = [];
  warehouseDict: { [id: number]: string } = {};
  productDict: { [id: number]: string } = {};
  selectedProduct: any = null;
  searchKeywordProduct: string = '';
  // previousSelectedWarehouseIds: string[] = [];
  previousSelectedProductIds: string[] = [];

  constructor(private router: Router, private InventoryService: InventoryService) { }

  ngOnInit(): void {
    //kiểm tra login
    const loggedInUser = localStorage.getItem('loggedInUser');
    this.loginInUser = JSON.parse(loggedInUser || '{}');
    this.newWarehouse.created_by = this.loginInUser.username;
    this.newProducts.created_by = this.loginInUser.username;
   
    if (!loggedInUser) {
      
      this.router.navigate(['/login']);
    }

    this.GetAllWarehouse();
    this.GetAllProducts(); 
  }

  isLoggedIn(): boolean {
    // Đặt logic kiểm tra đăng nhập ở đây
    const loggedInUser = localStorage.getItem('loggedInUser');
    return !!loggedInUser; // Trả về true nếu đã đăng nhập, ngược lại false
  }

  //lấy danh sách kho
  GetAllWarehouse() {
    this.InventoryService.getAllWarehouse().subscribe(
      (warehouse) => {
        // Filter out users with level 1
        this.warehouses = warehouse;

        this.warehouseDict = {};
        this.warehouses.forEach(wh => {
          this.warehouseDict[wh.id] = wh.name;
        });

        // console.log('Filtered warehouse:', this.warehouses);

      },
      (error) => {
        console.error('Error fetching warehouse', error);
        alert('An error occurred while trying to log in. Please try again later.');
      }
    );
  }

  selectWarehouse(warehouse: any): void {
    this.selectedWarehouses = { ...warehouse }; // Make a copy of the user object
    this.selectedProductIds = warehouse.product_code ? warehouse.product_code.split(',').map(Number) : [];
  }

  saveChanges(): void {
    console.log('lúc đầu',this.selectedWarehouses);
    const warehouse = this.selectedWarehouses;
    const productCode = warehouse.product_code;
    // Chuyển đổi selectedWarehouseIds và previousSelectedProductIds sang mảng chuỗi
    const previousSelectedIds = this.previousSelectedProductIds.map(id => id.toString());
    console.log('previousSelectedIds', previousSelectedIds);
    
    this.previousSelectedProductIds = [...this.selectedProductIds.map(id => id.toString())];
    console.log('currentSelectedIds', this.previousSelectedProductIds);
    // Tìm các kho đã bị bỏ chọn
    const unselectedWarehouseIds = previousSelectedIds.filter(id => !this.previousSelectedProductIds.includes(id))
    console.log('unselectedWarehouseIds', unselectedWarehouseIds);
    
    console.log('Product code:', productCode);
        // Chuyển đổi chuỗi thành mảng
    const productCodesList = productCode.split(',');

    // So sánh từng phần tử trong productCodesArray với productCodesList
    const allExist = this.previousSelectedProductIds.every(code => productCodesList.includes(code));

    console.log('All product codes exist:', allExist);

    // if(allExist){
    //   console.log('hello',unselectedWarehouseIds);
    //   const requestBody = { 
    //     warehouse_id:  this.previousSelectedProductIds,
    //     product_code: unselectedWarehouseIds,
    //    };
    //   this.InventoryService.updateWarehousehasProduct(this.selectedWarehouses.id, requestBody).subscribe(
    //     (response) => {
    //       console.log('User updated:', response);
    //       Swal.fire({
    //         icon: 'success',
    //         title: 'success',
    //         text: "Cập nhật thông tin thành công",
    //         confirmButtonText: 'Ok',
    //       });

    //       // Refresh the user list after update
    //       this.GetAllWarehouse();
    //       this.GetAllProducts();
    //     },
    //     (error) => {
    //       console.error('Error updating user', error);
    //       alert('An error occurred while trying to update the user. Please try again later.');
    //     }
    //   );
    // }
    if(this.selectedWarehouses)  {
      this.selectedWarehouses.product_code = this.selectedProductIds.join(',');
      console.log('this.selectedProductIds', this.selectedProductIds);

      this.InventoryService.updateWarehouse(this.selectedWarehouses.id, this.selectedWarehouses).subscribe(
        (response) => {
          console.log('User updated:', response);
          Swal.fire({
            icon: 'success',
            title: 'success',
            text: "Cập nhật thông tin thành công",
            confirmButtonText: 'Ok',
          });

          // Refresh the user list after update
          this.GetAllWarehouse();
          this.GetAllProducts();
        },
        (error) => {
          console.error('Error updating user', error);
          alert('An error occurred while trying to update the user. Please try again later.');
        }
      );
    }
  }

  getProductCount(productCodes: string): number {
    if (!productCodes) {
      return 0;
    }
    return productCodes.split(',').length;
  }

  addNewWarehouse(): void {
    this.newWarehouse.product_code = this.selectedAddProductToWarehouses.join(',');
    console.log('Selected selectedAddProductToWarehouses:', this.selectedAddProductToWarehouses);
    this.InventoryService.addWarehouse(this.newWarehouse).subscribe(
      (response) => {
        console.log('New kho added:', response);
        // Tạo mảng yêu cầu cập nhật
        const productUpdates: any[] = [];

        // Lặp qua các kho đã chọn để cập nhật sản phẩm mới vào
        this.selectedAddProductToWarehouses.forEach(productId => {
          console.log('productId', productId);
          // Lấy thông tin kho từ server
          this.InventoryService.getProductById(productId.toString()).subscribe(
            (productResponse) => {
              // Lấy danh sách mã sản phẩm hiện tại trong kho
              let currentProductCodes = productResponse.warehouse_id ? productResponse.warehouse_id.split(',') : [];
              console.log('currentProductCodes', currentProductCodes);
              // Lấy số sản phẩm từ phản hồi
              const numberOfProductsAdded = response.warehouse;
              console.log('numberOfProductsAdded', numberOfProductsAdded);

              // Thêm mã sản phẩm mới vào danh sách nếu chưa có
              if (!currentProductCodes.includes(numberOfProductsAdded.toString())) {
                currentProductCodes.push(numberOfProductsAdded.toString());

                // Cập nhật requestBody
                const requestBody = { warehouse_id: currentProductCodes.join(',') };

                // Thêm vào mảng yêu cầu cập nhật
                productUpdates.push({ productId, requestBody });
                console.log('12',productUpdates.length);
                // Nếu đã lặp qua hết các kho, thực hiện cập nhật
                if (productUpdates.length === this.selectedAddProductToWarehouses.length) {
                  this.performProductUpdates(productUpdates);
                  console.log('1');
                  
                 
                }
                
                console.log('2');
              }
            },
            (warehouseError) => {
              console.error('Error fetching warehouse', warehouseError);
              alert('An error occurred while trying to fetch the warehouse. Please try again later.');
            }
          );
        });
        Swal.fire({
          icon: 'success',
          title: 'success',
          text: "Thêm mới kho thành công",
          confirmButtonText: 'Ok',
        });
        this.GetAllWarehouse();
        this.GetAllProducts();
      },
      (error) => {
        console.error('Error adding new user', error);
        alert('An error occurred while trying to add the user. Please try again later.');
      }
    );
  }

  getProductNamesByIds(ids: string): string {
    if (!ids) {
      return 'Không có sản phẩm';
    }
    const idArray = ids.split(',').map(id => parseInt(id.trim(), 10));
    const names = idArray.map(id => this.productDict[id] || 'Unknown');
    return names.join(', ');
  }

  deleteWarehouse(warehouseId: number): void {
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
        this.InventoryService.deleteWarehouse(warehouseId).subscribe(
          (response) => {
            console.log('User deleted:', response);
            Swal.fire({
              icon: 'success',
              title: 'Thành công!',
              text: 'Kho hàng đã được xoá thành công.',
              confirmButtonText: 'OK'
            });
            this.GetAllWarehouse(); // Reload users after deletion
          },
          (error) => {
            console.error('Error deleting Warehouse', error);
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

  searchWarehouse(): void {
    if (this.searchKeyword.trim() === '') {
      this.GetAllWarehouse(); // Reload all users if search field is empty
      return;
    }

    // Perform search based on username, name, and level
    this.InventoryService.searchWarehouse(this.searchKeyword).subscribe(
      (results) => {
        this.warehouses = results;
      },
      (error) => {
        console.error('Error searching users', error);
        alert('An error occurred while trying to search users. Please try again later.');
      }
    );
  }

  addNewProducts(): void {
    this.newProducts.warehouse_id = this.selectedProductToWarehouses.join(',');
    console.log('Selected warehouses:', this.selectedProductToWarehouses);

    this.InventoryService.addProducts(this.newProducts).subscribe(
      (response) => {
        console.log('New sản phẩm added:', response);
        // Tạo mảng yêu cầu cập nhật
        const warehouseUpdates: any[] = [];

        // Lặp qua các kho đã chọn để cập nhật sản phẩm mới vào
        this.selectedProductToWarehouses.forEach(warehouseId => {

          // Lấy thông tin kho từ server
          this.InventoryService.getWarehouseById(warehouseId.toString()).subscribe(
            (warehouseResponse) => {
              // Lấy danh sách mã sản phẩm hiện tại trong kho
              let currentProductCodes = warehouseResponse.product_code ? warehouseResponse.product_code.split(',') : [];
              console.log('currentProductCodes', currentProductCodes);
              // Lấy số sản phẩm từ phản hồi
              const numberOfProductsAdded = response.products;
              console.log('Số sản phẩm đã thêm:', numberOfProductsAdded);

              // Thêm mã sản phẩm mới vào danh sách nếu chưa có
              if (!currentProductCodes.includes(numberOfProductsAdded.toString())) {
                currentProductCodes.push(numberOfProductsAdded.toString());

                // Cập nhật requestBody
                const requestBody = { product_code: currentProductCodes.join(',') };

                // Thêm vào mảng yêu cầu cập nhật
                warehouseUpdates.push({ warehouseId, requestBody });

                // Nếu đã lặp qua hết các kho, thực hiện cập nhật
                if (warehouseUpdates.length === this.selectedProductToWarehouses.length) {
                  this.performWarehouseUpdates(warehouseUpdates);
                }
              }
            },
            (warehouseError) => {
              console.error('Error fetching warehouse', warehouseError);
              alert('An error occurred while trying to fetch the warehouse. Please try again later.');
            }
          );
        });
        Swal.fire({
          icon: 'success',
          title: 'success',
          text: "Thêm mới sản phẩm thành công",
          confirmButtonText: 'Ok',
        });

        this.GetAllProducts();
      },
      (error) => {
        console.error('Error adding new user', error);
        alert('An error occurred while trying to add the user. Please try again later.');
      }
    );
  }

  //lấy danh sách sản phẩm
  GetAllProducts() {
    this.InventoryService.getAllProduct().subscribe(
      (product) => {
        // Filter out users with level 1
        this.products = product;

        this.productDict = {};
        this.products.forEach(wh => {
          this.productDict[wh.id] = wh.name;
        });
        // console.log('Filtered products:', this.products);

      },
      (error) => {
        console.error('Error fetching products', error);
        alert('An error occurred while trying to log in. Please try again later.');
      }
    );
  }

  getWarehouseNamesByIds(ids: string): string {
    if (!ids) {
      return 'không thuộc kho hàng nào';
    }
    const idArray = ids.split(',').map(id => parseInt(id.trim(), 10));
    const names = idArray.map(id => this.warehouseDict[id] || 'Unknown');
    return names.join('<br>');
  }

  saveChangesProducts(): void {

    this.selectedProduct.warehouse_id = this.selectedWarehouseIds.join(',');
    if (this.selectedProduct) {
      this.InventoryService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
        (response) => {
          this.handleProductUpdateSuccess(response);
        },
        (error) => {
          this.handleProductUpdateError(error);
        }
      );
    }

  }

  handleProductUpdateSuccess(response: any): void {

    Swal.fire({
      icon: 'success',
      title: 'success',
      text: "Cập nhật thông tin sản phẩm thành công",
      confirmButtonText: 'Ok',
    });

    this.updateProductInWarehouses();
    this.GetAllProducts();
    this.GetAllWarehouse();
  }

  handleProductUpdateError(error: any): void {
    console.error('Error updating user', error);
    alert('An error occurred while trying to update the user. Please try again later.');
  }

  previousSelectedWarehouseIds: number[] = [];
  onWarehouseChange(event: any): void {
    // Lưu tất cả các ID kho được chọn vào previousSelectedWarehouseIds trước khi thay đổi
    this.previousSelectedWarehouseIds = [...this.selectedWarehouseIds]; 
    console.log('previousSelectedWarehouseIds', this.selectedWarehouseIds);


    // Xử lý khi lựa chọn kho thay đổi
    console.log('Selected warehouse IDs:', this.selectedWarehouseIds);
  
    // Lấy danh sách các kho bị bỏ chọn
    const unselectedWarehouseIds = this.previousSelectedWarehouseIds.filter(id => !this.selectedWarehouseIds.includes(id));
    console.log('Unselected warehouse IDs:', unselectedWarehouseIds);
  
    // Lấy danh sách các kho mới được chọn
    const newlySelectedWarehouseIds = this.selectedWarehouseIds.filter(id => !this.previousSelectedWarehouseIds.includes(id));
    console.log('Newly selected warehouse IDs:', newlySelectedWarehouseIds);
  
    // Cập nhật lại trạng thái
    this.previousSelectedWarehouseIds = [...this.selectedWarehouseIds]; 
  }

  updateProductInWarehouses(): void {
    const productCode = this.selectedProduct.id;

    // Lưu các yêu cầu cập nhật kho vào mảng
    const warehouseUpdates: any[] = [];
  
    // // Khởi tạo mảng lưu trữ các yêu cầu cập nhật
    // const updateRequests: { warehouseId: string, requestBody: any }[] = [];

    // // Lấy danh sách các kho bị bỏ chọn
    // const unselectedWarehouseIds = this.previousSelectedWarehouseIds.filter(id => !this.selectedWarehouseIds.includes(id));
    // console.log('unselectedWarehouseIds', unselectedWarehouseIds);

    // // Lặp qua các kho bị bỏ chọn để tạo yêu cầu cập nhật
    // unselectedWarehouseIds.forEach(warehouseId => {
    //   this.InventoryService.getWarehouseById(warehouseId.toString()).subscribe(
    //     (warehouseResponse) => {
    //       let productCodes = warehouseResponse.product_code ? warehouseResponse.product_code.split(',') : [];
    //       const index = productCodes.indexOf(this.selectedProduct.id.toString());
    //       if (index !== -1) {
    //         productCodes.splice(index, 1);

    //         const requestBody = { product_code: productCodes.join(',') };

    //         // Thêm vào mảng yêu cầu cập nhật
    //         updateRequests.push({  warehouseId: warehouseId.toString(), requestBody });

    //         // Gọi hàm thực hiện cập nhật khi đã tạo đủ yêu cầu
    //         if (updateRequests.length === unselectedWarehouseIds.length) {
    //           this.performProductWarehouseUpdates(updateRequests);
    //         }
    //       }
    //     },
    //     (warehouseError) => {
    //       console.error('Error fetching warehouse', warehouseError);
    //       alert('An error occurred while trying to fetch the warehouse. Please try again later.');
    //     }
    //   );
    // });

    this.selectedWarehouseIds.forEach(warehouseId => {
      this.InventoryService.getWarehouseById(warehouseId.toString()).subscribe(
        (warehouseResponse) => {
          let currentProductCodes = warehouseResponse.product_code ? warehouseResponse.product_code.split(',') : [];
          // Kiểm tra nếu sản phẩm chưa có trong kho, thêm vào
          if (!currentProductCodes.includes(productCode.toString())) {
            currentProductCodes.push(productCode.toString());
          } else {
            // Nếu sản phẩm đã có trong kho và không có trong danh sách được chọn, xoá khỏi kho
            if (!this.selectedProduct.warehouse_id.includes(warehouseId.toString())) {
              console.log('2');
              currentProductCodes = currentProductCodes.filter((code: any) => code !== productCode.toString());
            }
          }

          // Cập nhật lại mã sản phẩm trong kho
          const requestBody = { product_code: currentProductCodes.join(',') };

          // Lưu trạng thái cập nhật kho vào mảng
          warehouseUpdates.push({ warehouseId, requestBody });

          // Thực hiện các yêu cầu cập nhật kho
          this.performWarehouseUpdates(warehouseUpdates);
        },
        (warehouseError) => {
          console.error('Error fetching warehouse', warehouseError);
          alert('An error occurred while trying to fetch the warehouse. Please try again later.');
        }
      );
    });
  }

  // Hàm thực hiện xoá sản phẩm trong từng kho cũ
  performProductWarehouseUpdates(updateRequests: { warehouseId: string, requestBody: any }[]): void {
    updateRequests.forEach(update => {
      // Convert warehouseId to number if needed
      const warehouseIdNumber = parseInt(update.warehouseId, 10);
      console.log('requestBody',update.requestBody)
      // Check if conversion is successful
      if (!isNaN(warehouseIdNumber)) {
        this.InventoryService.updateProductAddWarehouse(warehouseIdNumber, update.requestBody).subscribe(
          (updateResponse) => {
            // console.log('Warehouse updated:', updateResponse);
          },
          (updateError) => {
            console.error('Error updating warehouse', updateError);
            alert('An error occurred while trying to update the warehouse. Please try again later.');
          }
        );
      } else {
        console.error('Invalid warehouseId:', update.warehouseId);
        alert('Invalid warehouseId. Please check the warehouseId and try again.');
      }
    });
  }

  // Hàm thực hiện cập nhật sản phẩm trong từng kho 
  performWarehouseUpdates(warehouseUpdates: any[]): void {
    // Lặp qua các yêu cầu cập nhật và gọi service để cập nhật kho
     console.log('warehouseUpdates',warehouseUpdates);
    warehouseUpdates.forEach(update => {

      this.InventoryService.updateProductAddWarehouse(update.warehouseId, update.requestBody).subscribe(
        (updateResponse) => {
          // console.log('Warehouse updated:', updateResponse);
        },
        (updateError) => {
          console.error('Error updating warehouse', updateError);
          alert('An error occurred while trying to update the warehouse. Please try again later.');
        }
      );
    });

    // Hiển thị thông báo hoàn tất cập nhật
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: "Cập nhật thông tin thành công",
      confirmButtonText: 'OK',
    });

    // Làm mới danh sách sản phẩm và kho sau khi cập nhật
    this.GetAllProducts();
    this.GetAllWarehouse();
  }

  // Hàm thực hiện cập nhật sản phẩm trong từng kho 
  performProductUpdates(productUpdates: any[]): void {
    // Lặp qua các yêu cầu cập nhật và gọi service để cập nhật kho
    // console.log(warehouseUpdates);
    productUpdates.forEach(update => {

      this.InventoryService.updateProductByWarehouse(update.productId, update.requestBody).subscribe(
        (updateResponse) => {
          // console.log('Warehouse updated:', updateResponse);
        },
        (updateError) => {
          console.error('Error updating warehouse', updateError);
          alert('An error occurred while trying to update the warehouse. Please try again later.');
        }
      );
    });

    // Hiển thị thông báo hoàn tất cập nhật
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: "Cập nhật thông tin thành công",
      confirmButtonText: 'OK',
    });

    // Làm mới danh sách sản phẩm và kho sau khi cập nhật
    this.GetAllWarehouse();
    this.GetAllProducts();
  }

  selectProduct(product: any): void {
    this.selectedProduct = { ...product }; // Make a copy of the user object
    this.selectedWarehouseIds = product.warehouse_id ? product.warehouse_id.split(',').map(Number) : [];
    
  }

  deleteProduct(productId: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn chắc chắn?',
      text: 'Bạn có muốn xoá sản phẩm này không?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.InventoryService.deleteProduct(productId).subscribe(
          (response) => {
            console.log('User productId:', response);
            Swal.fire({
              icon: 'success',
              title: 'Thành công!',
              text: 'sản phẩm đã được xoá thành công.',
              confirmButtonText: 'OK'
            });
            this.GetAllProducts(); // Reload users after deletion
          },
          (error) => {
            console.error('Error deleting Warehouse', error);
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi xoá sản phẩm. Vui lòng thử lại sau.',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }

  searchProduct(): void {
    if (this.searchKeywordProduct.trim() === '') {
      this.GetAllProducts(); // Reload all users if search field is empty
      return;
    }

    // Perform search based on username, name, and level
    this.InventoryService.searchProduct(this.searchKeywordProduct).subscribe(
      (results) => {
        this.products = results;
      },
      (error) => {
        console.error('Error searching users', error);
        alert('An error occurred while trying to search users. Please try again later.');
      }
    );
  }
  // loadUsers(): void {
  //   this.InventoryService.getAllAccountNotAdmin().subscribe(
  //     (users) => {
  //       this.users = users;
  //     },
  //     (error) => {
  //       console.error('Error fetching users', error);
  //       alert('An error occurred while trying to fetch users. Please try again later.');
  //     }
  //   );
  // }
}
