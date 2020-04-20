const http = require('http');
const https = require('https');
const fs = require('fs');

export const downloadFile = (url: string, dest: string) => {
    const writeStream = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
        let responseSent = false;
        const _http = url.startsWith("https") ? https : http;

        _http.get(url, (response: any) => {
            response.pipe(writeStream);

            writeStream.on('finish', () => {
                writeStream.close(() => {
                    if (responseSent) {
                        return;
                    }
                    responseSent = true;
                    resolve();
                });
            });

        }).on('error', (err: any) => {
            if (responseSent) {
                return;
            }
            responseSent = true;
            reject(err);
        });
    });
};
