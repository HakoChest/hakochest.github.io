# 预配置项


预配置项一共有两个，即[大恒相机官方驱动](https://www.daheng-imaging.com/)和[OpenCV](https://opencv.org/)。

## 大恒相机官方驱动

GXCI库基于大恒相机官方提供的C语言dll（即GxIAPI.dll）进行开发，默认位于C:\Program Files\Daheng Imaging\GalaxySDK\APIDll\Win64\GxIAPI.dll

直接前往[大恒官网下载中心](https://www.daheng-imaging.com/downloads/)下载你所使用的相机的驱动即可。

## OpenCV

GXCI默认依赖的图像处理库为[opencv](https://crates.io/crates/opencv),即OpenCV的Rust绑定库。

这部分配置可以参照如下几个文章，但都是英文
- [opencv-rust的INSATLL.md](https://github.com/twistedfall/opencv-rust/blob/master/INSTALL.md)
- [(Win)用Chocolatey安装OpenCV](https://github.com/twistedfall/opencv-rust/issues/118#issuecomment-619608278)
- [(Win)解决STATUS_DLL_NOT_FOUND问题](https://github.com/twistedfall/opencv-rust/issues/113)

当然我们这里也提供了一份中文版的opencv-rust配置方法

### 安装LLVM和OpenCV 4.10.0
在Windows 10/11中，我建议使用Chocolatey来安装LLVM和OpenCV 4.10.0：

```shell
choco install llvm opencv
```

以下是一些会用到的官方网站：
- [LLVM](https://releases.llvm.org/download.html)
- [OpenCV](https://opencv.org/releases/)
- [Chocolatey](https://chocolatey.org/)

### 添加Path环境变量（系统变量）

将以下路径添加到相应的系统的Path环境变量中：
1. OpenCV的bin路径
2. OpenCV的x64 bin路径
3. Chocolatey的bin路径
4. LLVM的bin路径

请根据你的安装路径自行调整，下面是一个示例：
```shell
C:\tools\opencv\build\bin
C:\tools\opencv\build\x64\vc16\bin
C:\ProgramData\chocolatey\bin
C:\Program Files\LLVM\bin
```

### 添加OpenCV环境变量（系统变量）

新建三个系统变量：
1. OPENCV_INCLUDE_PATHS
2. OPENCV_LINK_LIBS
3. OPENCV_LINK_PATHS

请根据你的安装路径自行调整，下面是一个示例：
|变量名|变量值|
|---|---|
|OPENCV_INCLUDE_PATHS|C:\tools\opencv\build\include|
|OPENCV_LINK_LIBS|opencv_world410|
|OPENCV_LINK_PATHS|C:\tools\opencv\build\x64\vc16\lib|

### 复制opencv_world410.dll到目标目录（如果需要）

有时候你需要将opencv_world4100.dll复制到目标目录，即与exe文件同级的目录。

### 重启电脑（如果需要）

有时候你需要重启电脑才能使环境变量生效。

## Galaxy Viewer （可选）

[Galaxy Viewer](https://www.daheng-imaging.com/downloads/)是大恒相机官方提供的相机调试工具，可以用来查看相机的参数、调整相机的参数等。



## 难绷碎碎念

OpenCV库在这里用于方便地将图像矩阵化并提供GUI显示图像，说白了就用来保存图片和显示推流的，实际上GXCI目前并没有用到太多的图像处理算法。

怎么说呢，我认为OpenCV在图像处理领域确实是一个必要的库，所以我们也re-export了这个库，依赖启用了`use-opencv`的`gxci`就可以直接用`use gxci::opencv`来使用opencv。

但是OpenCV的缺点是配置和编译时间都有点难绷，所以这里还提供了一个`use-imageproc`特性，通过使用`imageproc`库来避免使用OpenCV。

但是在我测试的过程中`imageproc`的编译时间也很长（或者说就没编译成果过），特别是在nalgebra部分。有一天我编译`imageproc`的nalgebra花了3个小时都还没完成，绝对是卡在那了，尝试被迫终止。所以我也只能认为OpenCV仍然是一个不错的选择了，所以GXCI默认启用的也就是`use-opencv`这个特性了。
