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

<img height="400" src="https://img.alicdn.com/imgextra/i3/O1CN016IaaIu1oz9qNNjm32_!!6000000005295-2-tps-1000-700.png" />

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
| <img src="https://img.alicdn.com/imgextra/i2/O1CN01JBq1951xVEVUN1Xic_!!6000000006448-2-tps-256-256.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i3/O1CN01ypn5cs1FuZJx5uLoI_!!6000000000547-2-tps-538-550.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i3/O1CN01B7bYBu1Z8kHTQOY82_!!6000000003150-2-tps-1540-1906.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i4/O1CN01athTdk25oU51Jvggd_!!6000000007573-2-tps-400-400.png" width="300" /> |
| 盒马集市                                                     | 飞猪周边游                                                   | 阿里健康大药房                                               | CUBA我的主场                                                 |
| <img src="https://img.alicdn.com/imgextra/i1/O1CN01DEPRRE22ks6teYNsT_!!6000000007159-2-tps-256-256.png" width="300" /> | <img src="https://img.alicdn.com/imgextra/i2/O1CN01Y9CAU11WwieFTqHWd_!!6000000002853-0-tps-1540-1906.jpg" width="300" /> | <img src="https://img.alicdn.com/imgextra/i1/O1CN01kH43st1DdxjHnVIQf_!!6000000000240-0-tps-1540-1906.jpg" width="300" /> | <img src="https://img.alicdn.com/imgextra/i2/O1CN01hdlRZ11tAO0zdP4dh_!!6000000005861-2-tps-600-600.png" width="300" /> |

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

> TODO 补充仓库如何开发调试

## 协议

[BSD License](https://github.com/raxjs/miniapp/blob/master/LICENSE)
