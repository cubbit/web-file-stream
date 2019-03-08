import {WebFileStream} from '../src';

describe('WebFileStream', () => 
{
    it('should create a readable stream from a file', (done) => 
    {
        const file_content = 'Test file';
        const file = new File([file_content], 'test_file', {
            type: 'text/plain',
        });
        
        const read_stream = WebFileStream.create_read_stream(file);

        read_stream.once('error', (error) =>
        {
            throw error;
        });

        read_stream.on('data', (data) => 
        {
            expect(data).toEqual(Buffer.from(file_content));
        });

        read_stream.on('end', done);
    });

    it('should create a readable stream from a file with start and end', (done) => 
    {
        const file_content = 'Test file';
        const file = new File([file_content], 'test_file', {
            type: 'text/plain',
        });
        
        const read_stream = WebFileStream.create_read_stream(file, {
            start: 2,
            end: file_content.length - 3
        });

        read_stream.once('error', (error) =>
        {
            throw error;
        });

        read_stream.on('data', (data) => 
        {
            // Note: -1 due to null-terminating string in text file
            expect(data).toEqual(Buffer.from(file_content.substring(2, file_content.length - 1))); 
            read_stream.destroy();
        });

        read_stream.on('close', done);
    });
});
