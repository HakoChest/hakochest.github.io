# Migration

If you are using GXCI for the first time, you can skip this section. This section is mainly to help GXCI users before 0.3.6 migrate to the new version.

GXCI has been using version 4.9.0 of OpenCV before 0.3.5, but GXCI has been using version 4.10.0 of OpenCV since 0.3.6. As of 0.3.7, the latest supported version of OpenCV is 4.11.0,

If users need to upgrade their OpenCV version, they can use the following command

## Upgrade OpenCV through Choco

```powershell
choco upgrade chocolatey
choco upgrade opencv
```

## Change system environment variables

Update the system variable `OPENCV_LINK_LIBS` to `opencv_world4100`

If you encounter the error `STATUS_DLL_NOT_FOUND` in the future, just copy a copy of `opencv_world4100.dll` to the same folder as the exe

## Clean up the old version Target

If you have used GXCI before, you may need to clean up the previous target folder, because the previous target folder may have some old dependent libraries, resulting in compilation errors

```shell
cargo clean
```
