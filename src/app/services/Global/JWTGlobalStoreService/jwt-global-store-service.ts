import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtGlobalStoreService {
  private tokenSignal: WritableSignal<string | any> = signal<string | any>(localStorage.getItem('tokenJWT'))
  public readonly token: Signal<string> = this.tokenSignal.asReadonly();

  setTokenSignal(token: string | null) {
    this.tokenSignal.set(token);
    if (token) {
      localStorage.setItem('tokenJWT', token);
    } else {
      localStorage.removeItem('tokenJWT');
    }
  }
}
