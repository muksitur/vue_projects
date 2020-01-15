# vue-pipe-explorer

## Git submodule initialization
```
git submodule init
git submodule update --remote
```

### Project setup
```
npm install
npm install -g gulp
npm install -g rollup
```

### Build potree submodule
```
npm run potree
# or: gulp build pack
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Test potree component
Visit http://localhost:8080/potree_lion_example.html

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Deployment notes
For local development you should only use the local development server started by
```
npm run serve
```
The `vue.config.js` is configured to reverse proxy requests according to the `APP_VUE_PROXY_HOST`
variable defined in the environment file `.env`.

For production deployment you need to configure the file `.env.production` and run
```
npm run build
```

If you intend to deploy the application to a subdirectory, you need to specify the directory in the
`APP_VUE_SUBDIRECTORY` variable (`.env.production`) and configure your nginx location entry:
```
     location /foo {
         alias /path/to/user-interface/dist;
         index index.html;
     }

```



### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
