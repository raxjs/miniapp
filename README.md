<p align="center">
  <a href="https://rax.js.org/docs/guide/about-miniapp">
    <img alt="Rax" src="https://user-images.githubusercontent.com/677114/59907138-e99f7180-943c-11e9-8769-07021d9fe1ca.png" width="66">
  </a>
</p>

<p align="center">
Rax 小程序是基于运行时驱动的完整跨端小程序开发体系。
</p>

---

🚗 **完整的 Rax DSL：** 使用完整的 Rax（React） DSL 以及状态管理相关能力，没有任何语法约束

⏱ **兼容 W3C 标准：** 支持标准 DOM 和 BOM API，像开发 Web 应用一样快速开发小程序

🚀 **支持双引擎混用：** 在小程序项目中，支持局部组件使用编译时方案构建，提供更极致的性能体验

📤 **多端支持：** 完整支持阿里小程序及微信小程序，即将支持字节跳动、百度、快手小程序

🍄 **跨端组件：** 通过 [Fusion Mobile](https://unpkg.com/@alifd/meet-docs/build/index.html) 提供跨多小程序的丰富的组件体系

⛳ **跨端 API：** 通过 [Uni API](https://universal-api.js.org/) 提供跨多小程序的统一 API

## 快速开始

```bash
$ npm init rax rax-miniapp-example # 选择小程序跨端应用的类型
$ cd rax-miniapp-example
$ npm install
$ npm start
```

然后使用小程序 IDE 即可开始调试：

<img height="400" src="https://img.alicdn.com/imgextra/i4/O1CN012SVwTs1XkBQWAurR1_!!6000000002961-2-tps-1000-700.png" />

## 文档

点击 [Rax 官网](https://rax.js.org/docs/guide/about-miniapp) 查看使用文档

## 示例

点击 [查看 Examples](./examples/README.md)

## 上线项目案例

> 如果你也在使用 Rax 开发小程序，欢迎补充到 [案例收集](https://github.com/raxjs/miniapp/issues/132) 的 issue 中。

### 微信小程序

| 盒马集市                                                     | 优酷视频                                                     | 全球精品免税城                                               | 阿里巴巴零售通                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="https://img.alicdn.com/imgextra/i3/O1CN010dn1r11QKLm5BeQNY_!!6000000001957-2-tps-752-658.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i3/O1CN01s027b51eHVwaNYfQ3_!!6000000003846-2-tps-430-430.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i4/O1CN01iP0Mqk1Ccl4Xu0Eoz_!!6000000000102-0-tps-430-430.jpg" width="300" /> | <img src="https://img.alicdn.com/imgextra/i3/O1CN011fvim91rXAUABIg9K_!!6000000005640-0-tps-258-258.jpg" width="300" /> |
| 恒安会员+                                                    | 雅高酒店集团                                                 | 零哇智能                                                     | 淘鲜达优选团长端                                             |
| <img src="https://img.alicdn.com/imgextra/i2/O1CN0117rpob1Fp4ZG2GFk9_!!6000000000535-0-tps-594-583.jpg" width="300" /> | <img src="https://img.alicdn.com/imgextra/i2/O1CN01DYPXp01Hsr4WK1MY8_!!6000000000814-2-tps-258-258.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i3/O1CN01UNzDFR1p04dOCB07y_!!6000000005297-2-tps-1130-1120.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i1/O1CN01SedXXL1vFXht0E52n_!!6000000006143-2-tps-258-258.png" width="300" /> |

[点击查看更多使用 Rax 的微信小程序](https://github.com/raxjs/miniapp/issues/132#issuecomment-826252099)

### 支付宝小程序

| 浙里办                                                       | 电影演出                                                     | 浙大一院总部一期                                             | 游戏充值                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="https://img.alicdn.com/imgextra/i2/O1CN01JBq1951xVEVUN1Xic_!!6000000006448-2-tps-256-256.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i3/O1CN01ypn5cs1FuZJx5uLoI_!!6000000000547-2-tps-538-550.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i2/O1CN011811q01iXK4r9iRwK_!!6000000004422-2-tps-1312-1312.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i4/O1CN01athTdk25oU51Jvggd_!!6000000007573-2-tps-400-400.png" width="300" /> |
| 盒马集市                                                     | 飞猪周边游                                                   | 阿里健康大药房                                               | CUBA我的主场                                                 |
| <img src="https://img.alicdn.com/imgextra/i1/O1CN01DEPRRE22ks6teYNsT_!!6000000007159-2-tps-256-256.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i3/O1CN01869HDq1uZPGoy8nqd_!!6000000006051-0-tps-1322-1322.jpg" width="300" /> | <img src="https://img.alicdn.com/imgextra/i4/O1CN01xXI6XV1wyFzRR2Sp2_!!6000000006376-0-tps-1340-1340.jpg" width="300" /> | <img src="https://img.alicdn.com/imgextra/i2/O1CN01hdlRZ11tAO0zdP4dh_!!6000000005861-2-tps-600-600.png" width="300" /> |

[点击查看更多使用 Rax 的支付宝小程序](https://github.com/raxjs/miniapp/issues/132#issuecomment-825370301)

### 淘宝小程序

[点击查看使用 Rax 的淘宝小程序](https://github.com/raxjs/miniapp/issues/132#issuecomment-826252138)

## 更新日志

点击查看 [CHANGELOG](./CHANGELOG.md)

## 社区

| 答疑钉钉群                                                   | GitHub issues                                            |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| <a href="https://ice.alicdn.com/assets/images/rax-outside.jpeg"><img src="https://ice.alicdn.com/assets/images/rax-outside.jpeg" width="200" /></a> | [GitHub issues](https://github.com/raxjs/miniapp/issues) |

## 贡献代码

请首先阅读 [Rax 贡献代码指南](https://github.com/alibaba/rax/wiki/CONTRIBUTING)，了解基础的规范。

### 开发配置

运行以下命令：

```shell
$ git clone git@github.com:raxjs/miniapp.git
$ cd miniapp
$ npm install
$ npm run setup
```

### 调试代码包

以调试 `rax-miniapp-runtime-webpack-plugin` 为例：

```shell
# 进入示例项目
$ cd examples/app-lifecycle
$ npm install
$ npm link ../../packages/rax-miniapp-runtime-webpack-plugin # 本地 link 要调试的代码包
$ npm start # 启动项目，打开小程序 IDE 进行调试
```

### 代码包组成

| NPM 包                             | 描述                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| miniapp-render                     | Rax 小程序运行时方案模拟 DOM/BOM API                         |
| miniapp-runtime-config             | Rax 小程序运行时方案工程公共配置                             |
| miniapp-history                    | Rax 小程序模拟 history                                       |
| rax-miniapp-babel-plugins          | Rax 小程序代码扫描 babel 插件                                |
| rax-miniapp-config-webpack-plugin  | Rax 小程序配置生成 Webpack 插件                              |
| rax-miniapp-runtime-webpack-plugin | Rax 小程序运行时方案模板代码生成 Webpack插件                 |
| driver-miniapp                     | Rax 小程序运行时方案 driver（[什么是 driver](https://github.com/alibaba/rax/wiki/Driver-Specification)） |
| jsx-compiler                       | Rax 小程序编译时方案核心编译器                               |
| jsx2mp-cli                         | Rax 小程序编译时方案命令行启动工具（废弃）                   |
| jsx2mp-loader                      | Rax 小程序编译时方案 Webpack loader                          |
| jsx2mp-runtime                     | Rax 小程序编译时方案运行时垫片                               |
| miniapp-builder-shared             | Rax 小程序公用方法及变量等                                   |
| miniapp-compile-config             | Rax 小程序编译时方案工程公共配置                             |

## 协议

[BSD License](https://github.com/raxjs/miniapp/blob/master/LICENSE)
