# Take a Image

## HAL Code Example

Taking a picture first requires opening the device with `gxi_open_device`, then calling `gxi_get_image` to get the image, and finally calling `gxi_save_image_as_png` to save the image in the buffer. After that, call `gxi_close_device` to close the device.

Of course, in addition to `gxi_get_image` to save the image data in the buffer and return `Resulf<()>`, there are also two functions `gxi_get_image_as_raw` and `gxi_get_image_as_bytes` that can return the acquired image data. The former returns `Result<&[u8]>`, and the latter returns `Result<Vec<u8>>`.

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

## HAL Attention

1. Of course, you can also take the lazy approach and import everything from 'device' at once, 23333
2. `gxi_open_device` defaults to opening the first device in `solo` mode. Multiple devices are not yet supported
3. `gxi_get_image` returns `Result<()>` because the image data is saved in the buffer, so this function only saves the image data in the buffer. If you want to get the image data, you can use the two functions `gxi_get_image_as_raw` and `gxi_get_image_as_bytes`
4. The parameter of the `gxi_save_image_as_png` function is the file name to save, and it is saved in the current directory


## RAW Code Example

Taking a picture first requires opening the device with `gx_open_device_by_index`, then sending the `GX_COMMAND_ACQUISITION_START` command to start the acquisition, then calling `gx_get_image` to get the image, after the acquisition is successful, calling the `opencv` library to convert the `image_buffer` to a `Mat` object, and finally calling the `imwrite` function of the `opencv` library to save the image. After that, call `gx_send_command` to send the `GX_COMMAND_ACQUISITION_STOP` command to stop the acquisition, and finally call `gx_close_device` to close the device.

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

## RAW Attention

1. Use with caution, it is more comfortable to use `hal` for normal development (mainly because I am lazy to write documents)
2. The `image_buffer` is released when it is returned, so if it is not returned to the current scope, it will be released in the `facade` function, causing the image data to be directly unavailable in the following text (send the guest without receiving the guest, then the guest dies in a foreign land~)
