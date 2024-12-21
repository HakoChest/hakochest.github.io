# 更改日志

## 0.1

- `raw`模块从`gxi_hako`库迁移过来，然后`gxi_hako`库进入`deprecated`状态
- 初步实现了`hal`模块，用于相机的基本操作

## 0.2

### 0.2.0

- 安全化了`raw`模块，现在所有对`raw`模块的调用都不需要`unsafe`块
- 初步实现了全局错误处理，但是是在`raw`模块的`gx_interface`中
- md文档中的图片上云，减少体积

### 0.2.3

- 重新加入了`solo`feature
- `gxci_init_default()`可以通过默认路径加载GxIAPI.dll，`gxci_check_device_handle()`可以检查设备句柄是否有效

### 0.2.4

- `gxi_get_device_handle()`用于获取设备句柄
- 初始化配置了`config`模块，但是没有实现任何功能


## 0.3

### 0.3.0

- 为`hal`添加了`check`模块，用于检查常见错误
- 为`hal`添加了`config`模块，用于配置相机参数，但是某些FeatureID缺失，导致部分功能未实现
- 为`hal`添加了`control`模块，用于控制相机，基于`Galaxy Viewer`的侧边栏

### 0.3.2

- `gxi_use_stream()`允许使用自定义流回调函数处理图像数据。您可以在`hal_use_stream`示例中查看用法

### 0.3.3

- re-export了`opencv`和`imageproc`，您可以通过`gxci::opencv`和`gxci::imageproc`访问这两个模块

### 0.3.4

- `gxi_get_image_as_frame_data()`、`gxi_get_image_as_raw()`和`gxi_get_image_as_bytes()`提供了使用图像数据的接口，并提供了示例

### 0.3.5

- 独立的`error.rs`模块和优化的错误处理部分

### 0.3.6

- 升级到OpenCV 4.10.0，依赖`opencv`和升级到最新的`0.93.5`
- 基于`mdbook`搭建了中文与英文的文档站，提供了快速上手的教程，网址为[https://hakochest.github.io/gxci/](https://hakochest.github.io/gxci/)


## 这啥，好像是之前写的，不过还是留着吧

旧版是一个叫做[gxi_hako](https://crates.io/crates/gxi_hako)的crate库，里面raw部分和utils部分的不完全实现，现在已经暂时弃用了;

新版也就是这一款gxci，里面包含了raw、HAL、utils三个部分的实现;

截至目前，2024年7月11日23点45分，已经完成了`features=["solo"]`部分的HAL库编写，多相机的feature还未实现，等再次闲下来再来更新吧(๑˃ᴗ˂)ﻭ

2024年9月8日21点15分，2.0更新！主要是错误处理和安全化，现在所有的库函数都是安全的了，同时建立了非常规范和健壮的错误处理。此外也更新了所有例子，消除了所有的Warning。

2024年9月19日16点09分，3.0更新！主要是增加了config模块，现在所有的HAL和raw-binding的config模块都已经实现了，你可以调节宽高、增益、白平衡以及一切已实现的相机参数！但是由于inc中部分FeatureID的缺失，所以config模块还有一些函数没有实现。此外，增加了control模块，这是基于Galaxy Viewer的侧边栏常用部分的封装。