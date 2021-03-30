<h1 align="center">Welcome to sync-files-cipher 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/sync-files-cipher" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/sync-files-cipher.svg">
  </a>
  <a href="https://github.com/oneCiser/Web-Sync-Files-Cipher#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/oneCiser/Web-Sync-Files-Cipher/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/oneCiser/Web-Sync-Files-Cipher/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/oneCiser/sync-files-cipher" />
  </a>
</p>

> One-way encrypted client-server file synchronization (mirroring) package in nodejs over sockets (SFC)

### 🏠 [Homepage](https://github.com/oneCiser/Web-Sync-Files-Cipher#readme)

## Install

```sh
npm install sync-files-cipher
```

## How to use server
```sh
const { createServer } = require('sync-files-cipher')
createServer(
    '8BZ3pCTp71LX5I//QsBYdz7w4JHXNVehSBXuXnScdqg=',
    'AAAAAAAAAAAAAAAAAAAAAA==',
    () => { console.log("Server listening");}
)
```



#### CreateServer function
> Create a socket server and start listen connections, return a nodejs net.Server instance
```
createServer(aesKey, iv, onLIstenCallback, port )
```

| Argument             | Type     | Description                                                                                                    |
|----------------------|----------|----------------------------------------------------------------------------------------------------------------|
| **aesKey**           | String   | The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details. |
| **iv**               | String   | Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details.                  |
| **onLIstenCallback** | Function | The callback when server is listening.                                                                         |
| **port**             | Number   | The port, default 9000.                                                                                        |
## How to use client

```
const { sync } = require('sync-files-cipher')
    // start to sync files or directory
    const watcher = await sync(
        '/clientpath',
        function (eventType, pathChanged) {
          console.log(eventType, pathChanged);
        },
        function (error) {
          console.log(error);
        },
        '/prefix'
    );

    // stop sync
    watcher.close()
    .then(() => console.log("Watcher closed"))
```
#### Sync function

> Sync the file client with backup files when there are changes,
return a nodejs FSWatcher instance

```
  sync (pathToWatch, userWatchCallback, userErrorCallback, pathPrefix, port, host
)
```

| Argument              | Type     | Description                                                        |
|-----------------------|----------|--------------------------------------------------------------------|
| **pathToWatch**       | String   | The path to watch.                                                 |
| **userWatchCallback** | Function | The callback to call when sync is executed and passes the enent type and the path changed.                      |
| **userErrorCallback** | Function | The callback to call when sync is crashed.                         |
| **pathPrefix**        | String   | The prefix path for use in server for sync upfiles, default empty. |
| **port**              | Number   | The server port, default 9000                                      |
| **host**              | String   | The prefix path, default empty                                     |

#### Event types

| Type            | Description                       |
|-----------------|-----------------------------------|
| **ADD_DIR**     | Runs when a directory is added.   |
| **ADD_FILE**    | It runs when they add a new file. |
| **REMOVE_DIR**  | Runs when a directory is deleted. |
| **REMOVE_FILE** | Runs when a file is deleted.      |
| **CHANGE**      | Runs when a file changes.         |
|                 |                                   |

#### Close function

> Stop watching.

```
watcherInstance.close()
    .then(() => 
    console.log("Watcher closed"))
```

## Authors

👤 **Juan Francisco Javier Perez Rivero, Deiver Guerra Carrascal**

* Github: [@oneCiser](https://github.com/oneCiser)
* Github: [@ingDeiver](https://github.com/IngDeiver)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/oneCiser/Web-Sync-Files-Cipher/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Juan Francisco Javier Perez Rivero](https://github.com/oneCiser), [Deiver Guerra Carrascal](https://github.com/IngDeiver).<br />
This project is [MIT](https://github.com/oneCiser/Web-Sync-Files-Cipher/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
