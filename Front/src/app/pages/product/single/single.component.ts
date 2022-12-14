import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { UserapiService } from 'src/app/services/userapi.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.css']
})
export class SingleComponent implements OnInit {

  products: any[] = [];
  constructor(private userdata: UserapiService, private data: ProductService, private _activated: ActivatedRoute, private router: Router) { }

  id: any = this._activated.snapshot.paramMap.get('id'); //get id parameter
  obj: any = {};
  checkOtpValueFlag = false;
  comment: any ="";
  userName: any = "";
  CheckOtp = new FormGroup({ otp: new FormControl('', [Validators.required]), })

  delete_product(id: any) {
    this.data.delete_product(id).subscribe(
      res => { console.log(res); alert('product deleted successfully'); },
      err => console.log(err),
      () => { this.router.navigate(['/']); }
    )
  }

  delete_comment(id: any,comment:any) {
    this.data.delete_comment(id,comment).subscribe(
      res => { console.log(res); this.router.navigate([`/single/${id}`]); },
      err => console.log(err),
      () => { this.router.navigate([`/single/${id}`]); }
    )
  }

  add_comment(id: any , newcomment: any , rate: any) {

    
    this.comment = {"comment":newcomment.value};
    // this.userName = {"userName":"test" };
    this.userName = {"userName":this.obj.userName };

    this.comment = Object.assign(this.comment, this.userName);
    this.obj.comments.push(this.comment);
    console.log("rate"+rate.value);

    if(rate.value ){
      const myRate = {"rate":rate.value};

      this.data.add_rate(id,myRate).subscribe(
        res => { console.log(res); this.router.navigate([`/single/${id}`]);   },
        err => { alert(err.error.message); console.log(err);},
        () => { })
      }
    
    this.data.add_comment(id,this.comment).subscribe(
      res => {  console.log(res); this.router.navigate([`/single/${id}`]);   },
      err => { alert(err.error.message); console.log(err);},
      () => { })
  }

  list_single_product() {
    this.data.list_single_product(this.id).subscribe(
      res => {
        this.obj = res.data;
        console.log("test" + this.products)
      },
      err => console.log(err),
      () => { }
    )
  }

  ngOnInit(): void { this.list_single_product() }

  CheckValidationOTP() {
    this.userdata.MyProfile().subscribe(
      res => {
         console.log(res.data.otp)
        if (res.data.otp == this.CheckOtp.value.otp) {
          this.checkOtpValueFlag = true;
          console.log(typeof this.id)
          this.userdata.AddToMyCart(this.id).subscribe(
            res => {
              this.router.navigate(['/myaccount'])
            })}},
      (err) => console.log(err),
      () => { console.log(this.checkOtpValueFlag) }
    )

}}
