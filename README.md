# AI招聘系统

## hosts

### 公共配置
127.0.0.1 dev.ai.jd.com
172.25.46.37 yapi.cbpmgt.com

### 开发环境
172.25.44.160 jddai.jd.com

### 测试环境
10.222.27.244 jddai.jd.com

## 安装说明
### node安装
建议安装node版本 : **node > 8.X** (推荐版本**8.11.0** )， 推荐通过nvm安装， 详见：

- window: [nvm-windows](https://github.com/coreybutler/nvm-windows)
- mac or linux: [nvm](https://github.com/nvm-sh/nvm)

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```