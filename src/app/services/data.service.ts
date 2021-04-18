import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

const DOSOMETHING = gql`
  mutation doSomething($input: someInput!) {
    doSomething(input: $input) 
  }
`;

export interface IDoSomethingDetails {
  something: string
}

export interface IDoSomethingResponse {
  doSomething: string
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private apollo: Apollo, private authService: AuthService) { }

  doSomething(details: IDoSomethingDetails) {

    return this.authService.refresh().pipe(mergeMap((auth) => {
      console.log('refreshed');
      return this.apollo.mutate<IDoSomethingResponse>({
        mutation: DOSOMETHING,
        variables: {
          input: details
        }
      }).pipe(mergeMap(data => {
        const result = data.data?.doSomething;
        return of(result);
      }));
    }));
  }
}
