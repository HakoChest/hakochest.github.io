# Adjusting Camera Settings

## HAL Code Example

Here we continue with the code from the previous streaming section. Here we adjust some camera parameters, such as setting the camera's resolution, automatic gain, etc., which are set by the `gxi_set_width`, `gxi_set_height`, `gxi_set_gain_auto_continuous`, and `gxi_set_gain` functions, respectively.

```rust
use gxci::hal::device::*;
use gxci::hal::base::*;
use gxci::hal::control::analog::*;
use gxci::hal::control::image_format::*;
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

    gxi_set_width(4024)?;
    
    gxi_set_height(3036)?;

    gxi_set_gain_auto_continuous()?;

    // gxi_set_gain(1.0)?;

    gxi_use_stream(frame_callback)?;

    gxi_close_device()?;

    gxci_close()?;

    Ok(())
}
```

## HAL Attention

1. Pay attention to the setting range of parameters, such as the setting range of resolution, the setting range of gain, etc. Exceeding the camera's limit range will cause the function to return an error.
2. In fact, the `control` module is written according to the setting interface of `Galaxy Viewer`, covering most of the camera parameter setting needs. However, it is set through the `gxi_get_feature_value` and `gxi_set_feature_value` functions at the bottom, so if there are special parameter setting needs, you can refer to the specific document to directly call these two functions.


## RAW Code Example

Oh, this hasn't been written yet

## RAW Attention

1. Write when I have time

