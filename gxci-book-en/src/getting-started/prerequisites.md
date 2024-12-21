# Prerequisites

There are two prerequisites in total, namely the [official driver of Daheng camera](https://www.daheng-imaging.com/) and [OpenCV](https://opencv.org/).

## Official driver of Daheng camera

GXCI library is developed based on the C language dll provided by the official driver of Daheng camera (i.e. GxIAPI.dll), which is located by default at C:\Program Files\Daheng Imaging\GalaxySDK\APIDll\Win64\GxIAPI.dll

You can download the driver of the camera you are using directly from the [official website of Daheng](https://www.daheng-imaging.com/downloads/).

## OpenCV

The default image processing library that GXCI depends on is [opencv](https://crates.io/crates/opencv), which is the Rust binding library of OpenCV.

This part of the configuration can refer to the following articles.
- [INSATLL.md of opencv-rust](https://github.com/twistedfall/opencv-rust/blob/master/INSTALL.md)
- [Install OpenCV with Chocolatey (Win)](https://github.com/twistedfall/opencv-rust/issues/118#issuecomment-619608278)
- [Solve the STATUS_DLL_NOT_FOUND problem (Win)](https://github.com/twistedfall/opencv-rust/issues/113)

Of course, we also provide a pre-configured method for OpenCV-rust.

### Install LLVM and OpenCV 4.10.0

In Windows 10/11, I recommend using Chocolatey to install LLVM and OpenCV 4.10.0:

```shell
choco install llvm opencv
```

Here are some official websites that will be used:
- [LLVM](https://releases.llvm.org/download.html)
- [OpenCV](https://opencv.org/releases/)
- [Chocolatey](https://chocolatey.org/)

### Add Path environment variables (system variables)

Add the following paths to the corresponding system Path environment variables:
1. OpenCV bin path
2. OpenCV x64 bin path
3. Chocolatey bin path
4. LLVM bin path

Please adjust according to your installation path, here is an example:
```shell
C:\tools\opencv\build\bin
C:\tools\opencv\build\x64\vc16\bin
C:\ProgramData\chocolatey\bin
C:\Program Files\LLVM\bin
```

### Add OpenCV environment variables (system variables)

Create three system variables:
1. OPENCV_INCLUDE_PATHS
2. OPENCV_LINK_LIBS
3. OPENCV_LINK_PATHS

Please adjust according to your installation path, here is an example:
|Variable name|Variable value|
|---|---|
|OPENCV_INCLUDE_PATHS|C:\tools\opencv\build\include|
|OPENCV_LINK_LIBS|opencv_world410|
|OPENCV_LINK_PATHS|C:\tools\opencv\build\x64\vc16\lib|

### Copy opencv_world410.dll to the target directory (if necessary)

Sometimes you need to copy opencv_world4100.dll to the target directory, which is the same directory as the exe file.

### Restart the computer (if necessary)

Sometimes you need to restart the computer to make the environment variables take effect.

## Galaxy Viewer (optional)

[Galaxy Viewer](https://www.daheng-imaging.com/downloads/) is a camera debugging tool provided by Daheng Imaging, which can be used to view camera parameters, adjust camera parameters, etc.

## Oh, what's this part? Unbengable babble

The OpenCV library is used here to conveniently matrix the image and provide GUI display of the image, in other words, to save the image and display the push stream. In fact, GXCI currently does not use too many image processing algorithms.

How should I put it, I think OpenCV is indeed a necessary library in the field of image processing, so we also re-exported this library, and the dependency enabled the `use-opencv` feature of `gxci` can directly use `use gxci::opencv` to use opencv.

But the disadvantage of OpenCV is that the configuration and compilation time are a bit difficult, so here is also a `use-imageproc` feature, which uses the `imageproc` library to avoid using OpenCV.

But in my testing process, the compilation time of `imageproc` is also very long (or I have never compiled it successfully), especially in the nalgebra part. One day I spent 3 hours compiling the nalgebra of `imageproc` and it was not finished yet, it was definitely stuck there, and I was forced to terminate the attempt. So I can only think that OpenCV is still a good choice, so the default feature enabled by GXCI is the `use-opencv` feature. 