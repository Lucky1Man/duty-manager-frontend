import { NgEventBus } from 'ng-event-bus';
import { AutoClosableComponent } from './AutoClosableComponent';
import { Events } from './duty-manager-events';

export class ProcessingComponent<TData> extends AutoClosableComponent {
  private _data: TData[] = [];

  constructor(
    eventBus: NgEventBus,
    onLoginDataSupplier: () => Promise<TData[]>
  ) {
    super();
    super.manage(
      eventBus
        .on(Events.LOGGED_IN)
        .subscribe(() =>
          onLoginDataSupplier().then((data) => this.replaceData(data))
        )
    );
  }

  protected async replaceDataPiece(
    searchingCallback: (piece: TData) => boolean,
    supplyingCallback: () => Promise<TData | null>
  ) {
    const supply = await supplyingCallback();
    if (supply) {
      this._data.splice(this._data.findIndex(searchingCallback), 1, supply);
    } else {
      this._data.splice(this._data.findIndex(searchingCallback), 1);
    }
  }

  protected async addDataPiece(supplyingCallback: () => Promise<TData>) {
    this._data.push(await supplyingCallback());
  }

  protected replaceData(data: TData[]) {
    this._data = data;
  }

  get data() {
    return this._data;
  }
}
