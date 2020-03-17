import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [LoginComponent],
  imports: [ReactiveFormsModule, AngularMaterialModule]
})
export class AuthModule {}
