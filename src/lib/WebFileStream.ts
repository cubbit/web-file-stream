import {BackpressuredReadableStream} from './BackpressuredReadableStream';

export interface FileReadStreamOptions
{
    start?: number;
    end?: number;
    chunk_size?: number;
}

export namespace WebFileStream
{
    export function create_read_stream(file: File, options?: FileReadStreamOptions): BackpressuredReadableStream
    {
        const reader = new FileReader();
        const chunk_size = options && options.chunk_size || 100 * 1024 * 1024; // 100 MB
        const max_size = options && options.end || file.size;
        let cursor = options && options.start || 0;

        const stream = new BackpressuredReadableStream((size: number, callback: any) => 
        {
            if(cursor >= max_size)
                return callback(null, null);

            reader.onloadend = (event: Event) =>
            {
                if(event.target)
                    callback(null, new Uint8Array((event.target as any).result));
            };

            const end = cursor + Math.min(chunk_size, max_size);
            const chunk = file.slice(cursor, end);

            reader.readAsArrayBuffer(chunk);
            cursor = end;
        });

        reader.onerror = (error: Event) => stream.destroy(error as any);
        return stream;
    }
}
