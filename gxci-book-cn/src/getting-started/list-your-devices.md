# 列举你的设备

## HAL代码示例

下面是列举已链接设备的示例代码。该示例代码使用 `gxi_count_devices` 和 `gxi_list_devices` 函数来获取设备数量和设备信息，然后使用 `print_device_info` 函数打印设备信息。

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

## HAL注意点
1. `hal`部分的`base`模块推荐还是直接`use gxci::hal::base::*`全部引入，一是里面的函数绝对都会用到，而是这里还re-export了`error`模块的`Result`类型，方便错误处理。
2. `gxci_init_default()`默认的初始化地址是`"C:\\Program Files\\Daheng Imaging\\GalaxySDK\\APIDll\\Win64\\GxIAPI.dll"`，如果你的dll文件不在默认路径，可以使用`gxci_init("your_dll_path")`来初始化。（暂时只支持绝对路径，请自行拼接适配）
3. `gxi_count_devices`函数的参数是超时时间，通常就传`1000`，单位是毫秒。
4. `gxi_list_devices`函数返回的是一个`Vec<GX_DEVICE_BASE_INFO>`，`GX_DEVICE_BASE_INFO`的具体内容参看[GXCI的Docs.rs文档的struct部分](https://docs.rs/gxci/latest/gxci/raw/gx_struct/index.html)或者大恒的C语言SDK文档，文档是SDK自带的，默认位置在`C:\Program Files\Daheng Imaging\GalaxySDK\Doc`，自己根据安装目录找一找就行。
5. 在程序结束时，记得调用`gxci_close()`来释放dll。

## RAW代码示例

下面是列举已链接设备的示例代码。首先new一个GXInstance,然后调用 `gx_init_lib` 函数来初始化库，接着调用 `gx_update_device_list` 和 `gx_get_all_device_base_info` 函数来获取设备数量和设备信息，然后使用 `print_device_info` 函数打印设备信息，最后调用 `gx_close_lib` 函数来关闭库。

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


## RAW注意点

1. 谨慎使用吧，平常开发用hal还是更舒服一些（主要还是懒得写文档了）