# 调整相机参数

## HAL代码示例

这里我们就承接着上面推流部分的代码进行了，这里我们调整了相机的一些参数，例如设置了相机的分辨率、自动增益等等，分别是通过`gxi_set_width`、`gxi_set_height`、`gxi_set_gain_auto_continuous`、`gxi_set_gain`函数。

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

## HAL注意点
1. 注意参数设置范围，例如分辨率的设置范围，增益的设置范围等等，超出相机限制范围会导致函数返回错误
2. 实际上`control`这个模块就是按照`Galaxy Viewer`的设置界面来对应编写了，涵盖了大部分的相机参数设置需求。但是底层都是通过`gxi_get_feature_value`和`gxi_set_feature_value`函数来设置的，所以如果有特殊的参数设置需求，可以参考具体文档来直接调用这两个函数


## RAW代码示例

哦豁，这个还没写


## RAW注意点

1. 有时间再写