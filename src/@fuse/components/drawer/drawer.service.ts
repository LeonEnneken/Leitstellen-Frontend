import { Injectable } from '@angular/core';
import { FuseDrawerComponent } from '@fuse/components/drawer/drawer.component';

@Injectable({
  providedIn: 'root'
})
export class FuseDrawerService {

  private _componentRegistry: Map<string, FuseDrawerComponent> = new Map<string, FuseDrawerComponent>();

  constructor() {
  }

  registerComponent(name: string, component: FuseDrawerComponent): void {
    this._componentRegistry.set(name, component);
  }

  deregisterComponent(name: string): void {
    this._componentRegistry.delete(name);
  }
  
  getComponent(name: string): FuseDrawerComponent | undefined {
    return this._componentRegistry.get(name);
  }
}
