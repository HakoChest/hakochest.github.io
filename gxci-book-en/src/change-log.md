# Change Log

## 0.1

- The `raw` module is migrated from the `gxi_hako` library, and then the `gxi_hako` library enters the `deprecated` state
- The `hal` module is initially implemented for basic camera operations

## 0.2

### 0.2.0

- The `raw` module is secured, and now all calls to the `raw` module do not require an `unsafe` block
- Initial implementation of global error handling, but in the `gx_interface` of the `raw` module
- Images in the md document are uploaded to the cloud to reduce volume

### 0.2.3

- The `solo` feature is reintroduced
- `gxci_init_default()` can load GxIAPI.dll from the default path, and `gxci_check_device_handle()` can check whether the device handle is valid
- `gxi_get_device_handle()` is used to obtain the device handle

### 0.2.4

- `gxi_get_device_handle()` is used to obtain the device handle
- The `config` module is initialized, but no functions are implemented

## 0.3

### 0.3.0

- Added the `check` module to `hal` for checking common errors
- Added the `config` module to `hal` for configuring camera parameters, but some FeatureIDs are missing, resulting in some functions not implemented
- Added the `control` module to `hal` for camera control, based on the sidebar of `Galaxy Viewer`

### 0.3.2

- `gxi_use_stream()` allows the use of custom stream callback functions to process image data. You can see the usage in the `hal_use_stream` example

### 0.3.3

- re-exported `opencv` and `imageproc`, you can access these two modules through `gxci::opencv` and `gxci::imageproc`

### 0.3.4

- `gxi_get_image_as_frame_data()`, `gxi_get_image_as_raw()` and `gxi_get_image_as_bytes()` provide interfaces for using image data, and provide examples

### 0.3.5

- Independent `error.rs` module and optimized error handling section

### 0.3.6

- Upgraded to OpenCV 4.10.0, dependency `opencv` upgraded to the latest `0.93.5`
- Built a Chinese and English document site based on `mdbook`, providing a quick start tutorial, the URL is [https://hakochest.github.io/gxci-en/](https://hakochest.github.io/gxci-en/)

### 0.3.7

- Upgraded to OpenCV 4.11.0, dependency `opencv` upgraded to the latest `0.94.2`
- Fixed an error in the hal_use_stream example

## What's this? It seems like it was written before, but let's keep it

The old version is a crate library called [gxi_hako](https://crates.io/crates/gxi_hako), which is not completely implemented in the raw and utils parts, and is now temporarily abandoned;

The new version is this gxci, which contains the implementation of the raw, HAL, and utils parts;

As of now, 11:45 PM on July 11, 2024, the HAL library writing part of `features=["solo"]` has been completed, and the multi-camera feature has not been implemented yet. Let's update it when we are free again(๑˃ᴗ˂)ﻭ

September 8, 2024, 9:15 PM, 2.0 update! Mainly error handling and security, now all library functions are safe, and a very standardized and robust error handling has been established. In addition, all examples have been updated, eliminating all warnings.

September 19, 2024, 4:09 PM, 3.0 update! Mainly added the config module, now all HAL and raw-binding config modules have been implemented, you can adjust width, height, gain, white balance and all implemented camera parameters! But due to the lack of some FeatureID in inc, some functions in the config module have not been implemented. In addition, the control module has been added, which is an encapsulation of the sidebar commonly used in Galaxy Viewer.
