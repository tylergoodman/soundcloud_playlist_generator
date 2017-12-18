import { Readable, ReadableOptions } from 'stream';


abstract class PaginatedFetchStream<T> extends Readable {

  private _currently_fetching = false;
  private _has_fetched_first_page = false;
  protected _buffer: T[] = [];
  protected _next_page: string;

  constructor(options?: ReadableOptions) {
    super({
      objectMode: true,
      ...options,
    });
  }

  protected abstract async fetch(): Promise<void>;

  protected transform(obj: T): any {
    return obj;
  }

  async _read() {
    if (this._buffer.length) {
      this.push(this.transform(this._buffer.shift()));
      return;
    }

    if (!this._currently_fetching) {
      if (this._has_fetched_first_page && !this._next_page) {
        this.push(null);
        return;
      }

      this._currently_fetching = true;
      await this.fetch();
      this._currently_fetching = false;
      this._has_fetched_first_page = true;
      this.push(this.transform(this._buffer.shift()));
    }
  }
}

export default PaginatedFetchStream;
