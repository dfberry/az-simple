import { Stream } from 'stream';

export async function streamToBuffer(readableStream: Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    readableStream.on(
      'data',
      (data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      }
    );
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}
