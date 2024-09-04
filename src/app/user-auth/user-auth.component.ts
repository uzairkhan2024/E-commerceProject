import { Component ,OnInit} from '@angular/core';
import { cart, login, product, signup } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent implements OnInit{

  showlogin:boolean=true;
  AuthError:string=""

  constructor( private user:UserService ,
    private product:ProductService){

  }

  ngOnInit(): void {
   this.user.userAuthReload();
  }

  Signup(data:signup){
    this.user.userSignUp(data)
}

login(data:login){
this.user.userLogin(data);
this.user.invalidUserAuth.subscribe((result)=>{
if(result){
  this.AuthError="Please Entre Valid User Detail"
}
})
}

openLogin(){
this.showlogin=false;
}

openSignUp(){
this.showlogin=true;
}

localCartToRemoteCart() {
  let data = localStorage.getItem('localCart');
  let user = localStorage.getItem('user');
  let userId= user && JSON.parse(user).id;
  if(data){
   let cartDataList:product[]= JSON.parse(data);
 
   cartDataList.forEach((product:product, index)=>{
     let cartData:cart={
       ...product,
       productId:product.id,
       userId
     }
     delete cartData.id;
     setTimeout(() => {
       this.product.AddToCart(cartData).subscribe((result)=>{
         if(result){
           console.warn("data is stored in DB");
         }
       })
     }, 500);
     if(cartDataList.length===index+1){
       localStorage.removeItem('localCart')
     }
   })
  }

  setTimeout(() => {
   this.product.getCartList(userId)
  }, 2000);
   
 }
}
