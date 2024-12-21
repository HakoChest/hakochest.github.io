# 采一张图

## HAL代码示例

采图首先要用`gxi_open_device`打开设备，然后调用`gxi_get_image`获取图像，最后调用`gxi_save_image_as_png`保存缓存区中的图像，然后调用`gxi_close_device`关闭设备就走完一遍流程了

当然，除了`gxi_get_image`把图像保存在缓存区这个返回`Resulf<()>`函数，还有`gxi_get_image_as_raw`和`gxi_get_image_as_bytes`两个函数可以返回拿到的图像数据，前者返回的是`Result<&[u8]>`，后者返回的是`Result<Vec<u8>>`。


```rust
use gxci::hal::device::*;
use gxci::hal::base::*;
use gxci::utils::debug::print_device_info;

fn main()->Result<()> {
    gxci_init_default()?;

    let device_num = gxi_count_devices( 1000)?;
    println!("Device number: {}", device_num);

    let base_info = gxi_list_devices()?;
    for device in &base_info {
        print_device_info(&device);
    }
    
    gxi_open_device()?;

    gxi_get_image()?;
    
    gxi_save_image_as_png("test.png")?;

    gxi_close_device()?;

    gxci_close()?;
    
    Ok(())
}
```

## HAL注意点
1. 当然偷懒直接把`device`的全部都引入也是可以的23333
2. `gxi_open_device`在`solo`模式下默认打开第一个设备，多设备暂时没写
3. `gxi_get_image`函数返回的是`Result<()>`，因为图像数据是保存在缓存区的，所以这个函数只是把图像数据保存在缓存区，如果要获取图像数据，可以使用`gxi_get_image_as_raw`和`gxi_get_image_as_bytes`两个函数
4. `gxi_save_image_as_png`函数的参数是保存的文件名，保存在当前目录下


## RAW代码示例

采图首先要用`gx_open_device_by_index`打开设备，然后发送`GX_COMMAND_ACQUISITION_START`命令开始采集，接着调用`gx_get_image`获取图像，采图成功后调用`opencv`库把`image_buffer`转换成`Mat`对象，然后调用`imwrite`函数保存图像，最后调用`gx_send_command`发送`GX_COMMAND_ACQUISITION_STOP`命令停止采集，然后调用`gx_close_device`关闭设备就走完一遍流程了

```rust

use std::mem::size_of;
use std::slice;

use opencv::{
    imgcodecs,
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
        facade::*,
    },
};


fn main() -> Result<()> {
    unsafe {
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
                println!(
                    "Device base info retrieved successfully. Number of devices: {}",
                    device_num
                );
                
                for device in &base_info {
                    print_device_info(&device);
                }

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

                    gx.gx_send_command(device_handle, GX_FEATURE_ID::GX_COMMAND_ACQUISITION_START)
                        .expect("Failed to send command");

                    // 这种写法在所有权机制下是错误的，因为image_buffer在返回的时候就已经被释放了
                    // let frame_data_facade = fetch_frame_data(&gx, device_handle);
                    // let mut frame_data = convert_to_frame_data(&frame_data_facade.unwrap());
                    
                    // 这种写法是正确的，因为image_buffer被返回到了当前作用域
                    #[allow(unused_variables)]
                    let (frame_data_facade, image_buffer) = fetch_frame_data(&gx, device_handle).unwrap();
                    let mut frame_data = convert_to_frame_data(&frame_data_facade);


                        let result = gx.gx_get_image(device_handle, &mut frame_data, 100);
                        match result {
                            Ok(_) => {
                                println!("Image captured successfully.");

                                if frame_data.nStatus == 0 {
                                    let data = slice::from_raw_parts(frame_data.pImgBuf as *const u8, (frame_data.nWidth * frame_data.nHeight) as usize);
                                    
                                    let mat = core::Mat::new_rows_cols_with_data(
                                        frame_data.nHeight, 
                                        frame_data.nWidth, 
                                        data
                                    ).unwrap();
                        
                                    let vec = core::Vector::<i32>::new();
                                    if imgcodecs::imwrite("right.png", &mat, &vec).unwrap() {
                                        println!("Image saved successfully.");
                                    } else {
                                        println!("Failed to save the image.");
                                    }
                                    
                                }
                            }
                            Err(e) => eprintln!("Failed to capture image: {:?}", e),
                        }

                    gx.gx_send_command(device_handle, GX_FEATURE_ID::GX_COMMAND_ACQUISITION_STOP)
                        .expect("Failed to send command");

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
}
```


## RAW注意点

1. 谨慎使用吧，平常开发用hal还是更舒服一些（主要还是懒得写文档了）
2. 这里还玩了会所有权游戏，image_buffer如果不返回到当前作用域，就会在facade的那个函数中被释放掉，导致下文直接就拿不到图像数据了（送客不接客，客死他乡了）