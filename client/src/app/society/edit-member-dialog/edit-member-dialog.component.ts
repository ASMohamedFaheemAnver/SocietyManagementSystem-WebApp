import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Member } from "src/app/member.model";

@Component({
  templateUrl: "edit-member-dialog.component.html",
})
export class EditMemberDialogComponent {
  private monthFee: number;
  private fine: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Member) {}

  onDate(event) {
    console.log(event.value);
  }
}
