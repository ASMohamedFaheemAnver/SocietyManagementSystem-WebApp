import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ResetPasswordDialogComponent } from "../reset-password-dialog/reset-password-dialog.component";
import { EnterEmailDialogComponent } from "../enter-email-dialog/enter-email-dialog.component";
import { Location } from "@angular/common";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;

  isLoading = false;
  hide = true;

  resetUserCategory: string;
  resetUserToken: string;

  signUpLink = "/auth/signup-member";

  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    if (this.authService.isUserAuth()) {
      this.router.navigateByUrl(`/${this.authService.getUserCategory()}/home`);
    }

    this.route.queryParams.subscribe((params) => {
      this.resetUserCategory = params["user_category"];
      this.resetUserToken = params["reset_token"];

      if (this.resetUserCategory && this.resetUserToken) {
        const enterPasswordDialogRef = this.matDialog.open(
          ResetPasswordDialogComponent,
          {
            disableClose: true,
            panelClass: "custom-dialog-container",
            maxWidth: "400px",
            data: {
              category: this.resetUserCategory,
              token: this.resetUserToken,
            },
          }
        );

        enterPasswordDialogRef.afterClosed().subscribe((password) => {
          this.location.replaceState(this.location.path().split("?")[0], "");
        });
      }
    });

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((emittedBoolean) => {
        this.isLoading = false;
      });

    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      category: new FormControl(null, { validators: [Validators.required] }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });

    this.form.patchValue({ category: "member" });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onChangeCategory(category: string) {
    if (category === "member") {
      this.signUpLink = "/auth/signup-member";
    } else if (category === "society") {
      this.signUpLink = "/auth/signup-society";
    }

    this.form.patchValue({ category: category });
  }

  onLogin() {
    if (this.form.invalid) {
      return;
    }
    console.log({ emitted: "loginComponent.onLogin", data: this.form.value });

    this.isLoading = true;

    this.authService.loginUser(
      this.form.value.email,
      this.form.value.password,
      this.form.value.category
    );
  }

  onForgotPassword() {
    const enterEmaildDialogRef = this.matDialog.open(
      EnterEmailDialogComponent,
      {
        disableClose: true,
        panelClass: "custom-dialog-container",
        maxWidth: "400px",
      }
    );
  }
}
