# List your devices

## HAL code example

Here is an example code that lists the devices connected to the computer. This example code uses the `gxi_count_devices` and `gxi_list_devices` functions to get the number of devices and device information, and then uses the `print_device_info` function to print the device information.

```rust

use gxci::hal::base::*;
use gxci::hal::device::{gxi_count_devices，gxi_list_devices};
use gxci::utils::debug::print_device_info;

fn main()->Result<()> {
    gxci_init_default()?;

    let device_num = gxi_count_devices(1000)?;
    println!("Device number: {}", device_num);

    let base_info = gxi_list_devices()?;
    for device in &base_info {
        print_device_info(&device);
    }
    
    gxci_close()?;

    Ok(())
}
```

## HAL Attention

1. It is recommended to import all functions from the `base` module of the `hal` part using `use gxci::hal::base::*`. This is because all functions in this module will be used, and the `Result` type of the `error` module is re-exported here for easy error handling.
2. The default initialization address of `gxci_init_default()` is `"C:\\Program Files\\Daheng Imaging\\GalaxySDK\\APIDll\\Win64\\GxIAPI.dll"`. If your DLL file is not in the default path, you can use `gxci_init("your_dll_path")` to initialize it. (Currently only absolute paths are supported, please concatenate them yourself)
3. The parameter of the `gxi_count_devices` function is the timeout time, usually just pass `1000`, in milliseconds.
4. The `gxi_list_devices` function returns a `Vec<GX_DEVICE_BASE_INFO>`. The specific content of `GX_DEVICE_BASE_INFO` can be found in the [struct section of the GXCI Docs.rs document](https://docs.rs/gxci/latest/gxci/raw/gx_struct/index.html) or Daheng's C language SDK document. The document is included with the SDK and is located by default at `C:\Program Files\Daheng Imaging\GalaxySDK\Doc`. You can find it yourself according to the installation directory.
5. Remember to call `gxci_close()` to release the DLL when the program ends.

## RAW code example

Here is an example code that lists the devices connected to the computer. First, create a `GXInstance`, then call the `gx_init_lib` function to initialize the library, then call the `gx_update_device_list` and `gx_get_all_device_base_info` functions to get the number of devices and device information, and then use the `print_device_info` function to print the device information, and finally call the `gx_close_lib` function to close the library.

```rust

use std::mem::size_of;
use gxci::{
    raw::{
        gx_interface::*, 
        gx_struct::*,
    },
    utils::{
        debug::print_device_info,
        builder::GXDeviceBaseInfoBuilder,
    },
};

fn main() {
        // You can change the library path as you need
        let gx = GXInstance::new("C:\\Program Files\\Daheng Imaging\\GalaxySDK\\APIDll\\Win64\\GxIAPI.dll").expect("Failed to load library");
        gx.gx_init_lib().expect("Failed to initialize library");

        let mut device_num = 0;
        gx.gx_update_device_list(&mut device_num, 1000)
            .expect("Failed to update device list");

        if device_num > 0 {

            let mut base_info: Vec<GX_DEVICE_BASE_INFO> = (0..device_num).map(|_| {
                GXDeviceBaseInfoBuilder::new().build()
            }).collect();
            
            // or you can use the following code to initialize the vector without using the builder

            // let mut base_info = vec![
            //     GX_DEVICE_BASE_INFO {
            //         szVendorName: [0; GX_INFO_LENGTH_32_BYTE],
            //         szModelName: [0; GX_INFO_LENGTH_32_BYTE],
            //         szSN: [0; GX_INFO_LENGTH_32_BYTE],
            //         szDisplayName: [0; GX_INFO_LENGTH_128_BYTE],
            //         szDeviceID: [0; GX_INFO_LENGTH_64_BYTE],
            //         szUserID: [0; GX_INFO_LENGTH_64_BYTE],
            //         accessStatus: GX_ACCESS_STATUS_CMD::Unknown,
            //         deviceClass: GX_DEVICE_CLASS::Unknown,
            //         reserved: [0; 300],
            //     };
            //     device_num as usize
            // ];

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

            } else {
                println!("Failed to retrieve device base info, status: {}", status);
            }
        } else {
            println!("No Devices found.");
        }

        gx.gx_close_lib().expect("Failed to close library");
        println!("Library closed.")
    }

```

## RAW Attention

1. Use with caution, it is more comfortable to use `hal` for normal development (mainly because I am lazy to write documents)
