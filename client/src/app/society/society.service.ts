import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject } from "rxjs";
import { Member } from "./society-members/member.model";

@Injectable({ providedIn: "root" })
export class SocietyService {
  private graphQLUrl = environment.backEndGraphQlUrl2;
  private societyStatusListenner = new Subject<boolean>();
  private membersUpdated = new Subject<Member[]>();
  private members: Member[] = [];

  constructor(private http: HttpClient) {}

  getSociety() {
    const graphqlQuery = {
      query: `{
        getSociety{
   	      _id
          name
          email
          imageUrl
          regNo
          address
        }
      }`,
    };
    return this.http.post(this.graphQLUrl, graphqlQuery);
  }

  getAllSocietyMembers() {
    const graphqlQuery = {
      query: `{
        getAllSocietyMembers{
   	      _id
          name
          email
          imageUrl
          address
          arrears
          approved
        }
      }`,
    };
    this.http.post(this.graphQLUrl, graphqlQuery).subscribe(
      (res) => {
        this.members = res["data"].getAllSocietyMembers;
        this.membersUpdated.next([...this.members]);
        this.societyStatusListenner.next(false);
      },
      (err) => {
        console.log(err);
        this.societyStatusListenner.next(false);
      }
    );
  }

  getMembersUpdateListenner() {
    return this.membersUpdated;
  }

  getSocietyStatusListenner() {
    return this.societyStatusListenner;
  }

  approveMember(memberId: string) {
    const graphqlQuery = {
      query: `
      mutation{
        approveMember(memberId: "${memberId}"){
          message
        }
      }`,
    };
    this.http.post(this.graphQLUrl, graphqlQuery).subscribe(
      (res) => {
        console.log(res);
        let updatedMembers = this.members;
        updatedMembers = updatedMembers.map((member) => {
          if (member._id === memberId) {
            member.approved = true;
          }
          return member;
        });
        this.members = updatedMembers;
        this.membersUpdated.next([...updatedMembers]);
        this.societyStatusListenner.next(false);
      },
      (err) => {
        console.log(err);
        this.societyStatusListenner.next(false);
      }
    );
  }
  disApproveMember(memberId: string) {
    const graphqlQuery = {
      query: `
      mutation{
        disApproveMember(memberId: "${memberId}"){
          message
        }
      }`,
    };
    this.http.post(this.graphQLUrl, graphqlQuery).subscribe(
      (res) => {
        console.log(res);
        let updatedMembers = this.members;
        updatedMembers = updatedMembers.map((member) => {
          if (member._id === memberId) {
            member.approved = false;
          }
          return member;
        });
        this.members = updatedMembers;
        this.membersUpdated.next([...updatedMembers]);
        this.societyStatusListenner.next(false);
      },
      (err) => {
        console.log(err);
        this.societyStatusListenner.next(false);
      }
    );
  }

  deleteMember(memberId: string) {
    const graphqlQuery = {
      query: `
      mutation{
        deleteMember(memberId: "${memberId}"){
          message
        }
      }`,
    };
    this.http.post(this.graphQLUrl, graphqlQuery).subscribe(
      (res) => {
        console.log(res);
        let updatedMembers = this.members;
        updatedMembers = updatedMembers.filter((member) => {
          return member._id !== memberId;
        });
        this.members = updatedMembers;
        this.membersUpdated.next([...updatedMembers]);
        this.societyStatusListenner.next(false);
      },
      (err) => {
        console.log(err);
        this.societyStatusListenner.next(false);
      }
    );
  }
}