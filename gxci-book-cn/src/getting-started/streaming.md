# 推流

## HAL代码示例

核心在于`gxi_use_stream`，这个`0.3.4`版本新增的函数

```rust
use gxci::hal::device::*;
use gxci::hal::base::*;
use gxci::utils::debug::print_device_info;
use gxci::utils::extract::{extract_callback_img_buf,extract_frame_callback_param};
use gxci::raw::gx_struct::GX_FRAME_CALLBACK_PARAM;
use gxci::raw::gx_interface::Result;
use gxci::opencv::{core, highgui};


extern "C" fn frame_callback(p_frame_callback_data: *mut GX_FRAME_CALLBACK_PARAM) {
    
    let frame_callback_data = extract_frame_callback_param(p_frame_callback_data);
    let data = extract_callback_img_buf(frame_callback_data);

    let mat = core::Mat::new_rows_cols_with_data(
        frame_callback_data.nHeight, 
        frame_callback_data.nWidth, 
        data
    ).unwrap();
    
    highgui::imshow("Camera Frame", &mat).unwrap();
    if highgui::wait_key(10).unwrap() > 0 {
        highgui::destroy_window("Camera Frame").unwrap();
    }
}

fn main()->Result<()> {
    gxci_init_default()?;

    let device_num = gxi_count_devices( 1000)?;
    println!("Device number: {}", device_num);

    let base_info = gxi_list_devices()?;
    for device in &base_info {
        print_device_info(&device);
    }

    gxi_open_device()?;

    gxi_use_stream(frame_callback)?;

    gxi_close_device()?;

    gxci_close()?;

    Ok(())
}
```

## HAL注意点
1. 最闪亮的函数当属`gxi_use_stream`，这个函数的参数是一个类型为`pub type GXCaptureCallBack = extern "C" fn(pFrameData: *mut GX_FRAME_CALLBACK_PARAM);`的回调函数，允许你自定义回调函数来处理推流采集到的图像数据。此外，在utils模块中还提供了`extract_callback_img_buf`和`extract_frame_callback_param`两个函数来帮助你提取回调函数中的图像数据。
2. 这里的`frame_callback`就仅仅只是把图像用opencv显示出来罢了，你可以根据自己的需求来处理图像数据。例如通过全局变量来暴露图像数据，然后在主线程中处理图像数据等等

## RAW代码示例

```rust

use std::mem::size_of;
use std::slice;
use std::thread::sleep;
use std::time::Duration;

use opencv::{
    highgui,
    core,
};

use gxci::{
    raw::{
        gx_interface::*, 
        gx_enum::*,
        gx_struct::*,
        gx_handle::*,
    },
    utils::{
        debug::print_device_info,
        builder::GXDeviceBaseInfoBuilder,
    },
};

extern "C" fn frame_callback(p_frame_callback_data: *mut GX_FRAME_CALLBACK_PARAM) {
    // 避免刷屏
    // println!("Frame callback triggered.");
    // println!("Frame status: {:?}", unsafe { (*p_frame_callback_data).status });
    // println!("Frame All: {:?}", unsafe { *p_frame_callback_data });

    unsafe {
        let frame_callback_data = &*p_frame_callback_data;
        if frame_callback_data.status == 0 {
            let data = slice::from_raw_parts(frame_callback_data.pImgBuf as *const u8, (frame_callback_data.nWidth * frame_callback_data.nHeight) as usize);
            let mat = core::Mat::new_rows_cols_with_data(
                frame_callback_data.nHeight, 
                frame_callback_data.nWidth, 
                // core::CV_8UC1, 
                data
            ).unwrap();
            highgui::imshow("Camera Frame", &mat).unwrap();
            if highgui::wait_key(10).unwrap() > 0 {
                highgui::destroy_window("Camera Frame").unwrap();
            }
        }
    }
}

fn main()->Result<()> {
        // You can change the library path as you need
        let gx = GXInstance::new("C:\\Program Files\\Daheng Imaging\\GalaxySDK\\APIDll\\Win64\\GxIAPI.dll").expect("Failed to load library");
        gx.gx_init_lib().expect("Failed to initialize library");

        // Update the device list
        let mut device_num = 0;
        gx.gx_update_device_list(&mut device_num, 1000)
            .expect("Failed to update device list");

        if device_num > 0 {

            let mut base_info: Vec<GX_DEVICE_BASE_INFO> = (0..device_num).map(|_| {
                GXDeviceBaseInfoBuilder::new().build()
            }).collect();
            let mut size = (device_num as usize) * size_of::<GX_DEVICE_BASE_INFO>();
            let status = gx
                .gx_get_all_device_base_info(base_info.as_mut_ptr(), &mut size)
                .expect("Failed to get all device base info");

            if status == 0 {
                // Assuming 0 is GX_STATUS_SUCCESS
                println!(
                    "Device base info retrieved successfully. Number of devices: {}",
                    device_num
                );
                
                for device in &base_info {
                    print_device_info(&device);
                }

                // Attempt to open the first device using its SN
                let first_device_sn = std::str::from_utf8(&base_info[0].szSN).unwrap_or("");
                let mut device_handle: GX_DEV_HANDLE = std::ptr::null_mut();

                let open_status = gx
                    .gx_open_device_by_index(1, &mut device_handle)
                    .expect("Failed to open device with index");

                if open_status == 0 {
                    println!(
                        "Successfully opened device index 1 with SN: {}",
                        first_device_sn.trim_end_matches(char::from(0))
                    );

                    gx.gx_set_float(device_handle, GX_FEATURE_ID::GX_FLOAT_GAIN, 20.0)?;

                    let reg_result = gx.gx_register_capture_callback(device_handle, frame_callback);
                    match reg_result {
                        Ok(_) => println!("Capture callback registered successfully."),
                        Err(e) => eprintln!("Failed to register capture callback: {:?}", e),
                    }

                    gx.gx_send_command(device_handle, GX_FEATURE_ID::GX_COMMAND_ACQUISITION_START)
                        .expect("Failed to send command");
                        
                        highgui::named_window("Camera", highgui::WINDOW_AUTOSIZE).unwrap();
                    loop {
                        sleep(Duration::from_secs(60));
                        break;
                    }

                    gx.gx_send_command(device_handle, GX_FEATURE_ID::GX_COMMAND_ACQUISITION_STOP)
                        .expect("Failed to send command");

                    let unregeister_result = gx.gx_unregister_capture_callback(device_handle);
                    match unregeister_result {
                        Ok(_) => println!("Capture callback unregistered successfully."),
                        Err(e) => eprintln!("Failed to unregister capture callback: {:?}", e),
                    }

                    // Close the device
                    gx.gx_close_device(device_handle)
                        .expect("Failed to close device");
                    println!("Device closed.")
                } else {
                    println!(
                        "Failed to open device with SN: {}",
                        first_device_sn.trim_end_matches(char::from(0))
                    );
                }
            } else {
                println!("Failed to retrieve device base info, status: {}", status);
            }
        } else {
            println!("No Devices found.");
        }

        gx.gx_close_lib().expect("Failed to close library");
        println!("Library closed.");
        Ok(())
    }

```

## RAW注意点

1. 谨慎使用吧，平常开发用hal还是更舒服一些（主要还是懒得写文档了）