# 从旧版本迁移

如果你是第一次使用GXCI那么，你可以跳过这一节。这一节主要是为了帮助0.3.6之前的GXCI用户迁移到新版本。

GXCI在0.3.5及此前的版本一直使用的是4.9.0版本的OpenCV，但GXCI从0.3.6开始使用4.10.0版本的OpenCV。所以用户也需要相应的升级一下自己的OpenCV版本

## 通过Choco升级OpenCV

```powershell
choco upgrade chocolatey
choco upgrade opencv
```

## 更改系统环境变量

把系统变量的`OPENCV_LINK_LIBS`更新为`opencv_world4100`即可

以后如果报错`STATUS_DLL_NOT_FOUND`，就复制一份`opencv_world4100.dll`到exe的同级文件夹就行

## 清理旧版本Target

如果你之前使用过GXCI，那么你可能需要清理一下之前的target文件夹，因为之前的target文件夹可能会有一些旧的依赖库，导致编译错误

```shell
cargo clean
```