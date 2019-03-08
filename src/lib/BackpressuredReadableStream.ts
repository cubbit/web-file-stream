import {Readable} from 'stream';

export class BackpressuredReadableStream extends Readable
{
    private _try_read: (size: number, callback: any) => any;
    private _destroyed: boolean;
    private _reading: boolean;

    public constructor(try_read: (size: number, callback: (error: Error, data: any) => boolean | void) => any)
    {
        super();

        this._try_read = try_read;
        this._destroyed = false;
        this._reading = false;
    }

    public _read(size: number): void
    {
        if (this._reading || this._destroyed) 
            return;

        this._reading = true;
        this._try_read(size, this._check.bind(this));
    }

    public destroy(error?: Error): void
    {
        if(this._destroyed)
            return;
        
        this._destroyed = true;

        if(error)
            this.emit('error', error);
        
        this.emit('close');
    }

    private _check(error: Error, data: any): boolean | void
    {
        if(this._destroyed)
            return;

        if(error)
            return this.destroy(error);

        if(data === null)
            return this.push(null);

        this._reading = false;

        if(this.push(data))
            this._read(this.readableHighWaterMark);
    }
}
