import * as chokidar from "chokidar"


/**
 * Creating multiple chokidar watchers results in memory leaks and high memory usage in general.
 * Therefore, here, we provide only one chokidar listener. We dispatch events manually.
 */
export class FileWatcher {
    chokidarWatcher = new chokidar.FSWatcher();

    constructor(private dirPath: string, private onChange: (path: string) => void) {

    }

    async start() {
        return new Promise<void>((resolve, reject) => {
            this.chokidarWatcher = chokidar.watch(this.dirPath, {})
                .on('add', this.onChange)
                .on('change', this.onChange)
                .on('unlink', this.onChange)
                .on('addDir', this.onChange)
                .on('unlinkDir', this.onChange)
                .on('error', reject)
                .on('ready', resolve);
        });

    }

    async stop() {
        return this.chokidarWatcher.close();
    }
}

