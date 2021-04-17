import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { LocalstoreService } from './localstore.service';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

const SIGNUP = gql`
  mutation signup($input: signupDetails!) {
    signup(input: $input) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;

const REFRESH = gql`
  query refresh($id: ID!) {
    refresh(id: $id)
  }
`;

const LOGIN = gql`
  mutation login($input: loginDetails!) {
    login(input: $input) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apollo: Apollo, private localstore: LocalstoreService) {}

  currentUser() {
    return this.localstore.get('current-user');
  }

  signup(details: ISignupDetails) {
    return this.apollo.mutate<ISignupResponse>({
      mutation: SIGNUP,
      variables: {
        input: details
      }
    }).pipe(mergeMap(data => {
      const currentUser = data.data?.signup
      this.localstore.set('current-user', currentUser);
      console.log("in map", currentUser);
      return of(currentUser);
    }))
  }

  refresh() {
    let currentUser = this.localstore.get('current-user') as IAuth | null;

    return this.apollo.query<IRefreshResponse>({
      query: REFRESH,
      variables: {
        id: currentUser?.user.id
      }
    }).pipe(mergeMap(data => {
      if (currentUser) {
        currentUser.token = data.data.refresh;
        this.localstore.set('current-user', currentUser);
      }
      return of(currentUser);
    }));
  }

  signin(details: ILoginDetails) {
    return this.apollo.mutate<ILoginResponse>({
      mutation: LOGIN,
      variables: {
        input: details
      }
    }).pipe(mergeMap(data => {
      const currentUser = data.data?.login
      this.localstore.set('current-user', currentUser);
      console.log("in map (login)", currentUser);
      return of(currentUser);
    }))
  }

  signout() {
    this.localstore.remove('current-user');
  }
}

export interface ISignupDetails {
  email: string, username: string, password: string
}

export interface ILoginDetails {
  email: string, password: string
}

export interface IAuth {
  user: IUser,
  token: string
}

export interface ISignupResponse {
  signup: IAuth
}

export interface ILoginResponse {
  login: IAuth
}

export interface IRefreshResponse {
  refresh: string
}

export interface IUser {
  id: string,
  email: string,
  username: string
}