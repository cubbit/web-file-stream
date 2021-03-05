import {WebFileStream} from '../src';

describe('WebFileStream', () => 
{
    beforeEach(() =>
    {
        expect.hasAssertions();
    });

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
            try
            {
                expect(data).toEqual(Buffer.from(file_content));
            }
            catch(error)
            {
                done(error);
            }
        });

        read_stream.on('end', done);
    });

    it('should create a readable stream from a file with start and end', (done) => 
    {
        const file_content = 'Test file';
        const file = new File([file_content], 'test_file', {
            type: 'text/plain',
        });

        const start = 2;
        const end = file.size - 3;
        
        const read_stream = WebFileStream.create_read_stream(file, {
            start,
            end,
        });

        read_stream.once('error', (error) =>
        {
            throw error;
        });

        read_stream.on('data', (data) => 
        {
            const expect_data = Buffer.from(file_content.substring(start, end));
            
            try
            {
                expect(data.toString()).toEqual(expect_data.toString());
                read_stream.destroy();
            }
            catch(error)
            {
                return done(error);
            }
        });

        read_stream.on('close', done);
    });
});
