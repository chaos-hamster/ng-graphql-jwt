import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { LocalstoreService } from './localstore.service';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Emitters } from '../emitters/emitters'

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

  private _isLoggedIn: boolean = false;

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
    Emitters.authEmitter.emit(value);
  }

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
    console.log("start refresh", currentUser);

    return this.apollo.query<IRefreshResponse>({
      query: REFRESH,
      variables: {
        id: currentUser?.user.id
      },
      fetchPolicy: 'network-only'
    }).pipe(mergeMap(data => {
      if (currentUser) {
        console.log('in refresh', data.data.refresh)
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
      this.isLoggedIn = true;
      return of(currentUser);
    }))
  }

  signout() {
    this.localstore.remove('current-user');
    this.isLoggedIn = false;
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