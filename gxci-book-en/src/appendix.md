# Appendix

## GxIAPI.dll method implementation status

- [x] 302    0 0001C020 GXCloseDevice
- [x] 101    1 0001BBC0 GXCloseLib
- [x] 700    2 0001E9E0 GXExportConfigFile
- [ ] 707    3 0001EA50 GXExportConfigFileW  ?This function is not mentioned in the development document
- [x] 602    4 0001E920 GXFlushEvent
- [x] 505    5 0001E6E0 GXFlushQueue
- [x] 201    6 0001BDE0 GXGetAllDeviceBaseInfo
- [x] 414    7 0001D5F0 GXGetBool
- [x] 419    8 0001E080 GXGetBuffer
- [x] 418    9 0001DF50 GXGetBufferLength
- [ ] 205    A 0001BE80 GXGetDeviceIPInfo
- [ ] 423    B 0001C0B0 GXGetDevicePersistentIpAddress
- [x] 411    C 0001D3C0 GXGetEnum
- [x] 410    D 0001CF50 GXGetEnumDescription
- [x] 409    E 0001CE20 GXGetEnumEntryNums
- [x] 506    F 0001E970 GXGetEventNumInQueue
- [x] 422   10 0001C1E0 GXGetFeatureName
- [x] 408   11 0001CCF0 GXGetFloat
- [x] 406   12 0001C960 GXGetFloatRange
- [x] 504   13 0001E670 GXGetImage
- [x] 404   14 0001C730 GXGetInt
- [x] 403   15 0001C590 GXGetIntRange
- [x] 204   16 0001BC40 GXGetLastError
- [ ] 709   17 0001F370 GXGetOptimalPacketSize  (Windows Only)
- [x] 416   18 0001DAA0 GXGetString
- [x] 415   19 0001D820 GXGetStringLength
- [x] 425   1A 0001D970 GXGetStringMaxLength
- [ ] 705   1B 0001EEF0 GXGigEForceIp
- [ ] 704   1C 0001ECC0 GXGigEIpConfiguration
- [ ] 706   1D 0001F170 GXGigEResetDevice
- [x] 701   1E 0001EAC0 GXImportConfigFile
- [ ] 708   1F 0001EB40 GXImportConfigFileW  ?This function is not mentioned in the development document
- [x] 100   20 0001BB70 GXInitLib
- [x] 400   21 0001C260 GXIsImplemented
- [x] 401   22 0001C370 GXIsReadable
- [x] 402   23 0001C480 GXIsWritable
- [x] 301   24 0001BFB0 GXOpenDevice
- [x] 300   25 0001BF10 GXOpenDeviceByIndex
- [ ] 702   26 0001EBC0 GXReadRemoteDevicePort
- [ ] 710   27 0001F3E0 GXReadRemoteDevicePortStacked
- [x] 500   28 0001E5B0 GXRegisterCaptureCallback
- [x] 600   29 0001E730 GXRegisterDeviceOfflineCallback
- [x] 603   2A 0001E820 GXRegisterFeatureCallback
- [x] 421   2B 0001E480 GXSendCommand
- [x] 507   2C 0001F100 GXSetAcqusitionBufferNumber
- [x] 413   2D 0001D720 GXSetBool
- [x] 420   2E 0001E350 GXSetBuffer
- [ ] 424   2F 0001C160 GXSetDevicePersistentIpAddress
- [x] 412   30 0001D4F0 GXSetEnum
- [x] 407   31 0001CBE0 GXSetFloat
- [x] 405   32 0001C860 GXSetInt
- [x] 417   33 0001DDC0 GXSetString
- [x] 501   34 0001E620 GXUnregisterCaptureCallback
- [x] 601   35 0001E7B0 GXUnregisterDeviceOfflineCallback
- [x] 604   36 0001E8B0 GXUnregisterFeatureCallback
- [x] 206   37 0001BD70 GXUpdateAllDeviceList
- [x] 200   38 0001BD00 GXUpdateDeviceList
- [ ] 703   39 0001EC40 GXWriteRemoteDevicePort
- [ ] 711   3A 0001F450 GXWriteRemoteDevicePortStacked (Windows Only)

## HAL module function implementation status

- base
  - [x] gxi_check()
  - [x] gxci_init()
  - [x] gxci_init_default()
  - [x] gxci_close()
- device
  - [x] gxi_count_devices()
  - [x] gxi_list_devices()
  - [x] gxi_open_device()          // solo feature
  - [x] gxi_close_device()         // solo feature
  - [x] gxi_check_device_handle()  // solo feature
  - [x] gxi_send_command()          // solo feature
  - [x] gxi_get_image()             // solo feature
  - [x] gxi_open_stream()           // solo feature
  - [x] gxi_open_stream_interval()  // solo feature
  - [x] gxi_close_stream()          // solo feature
- check
  - [x] check_status()
  - [x] check_status_with_ok_fn()
  - [x] check_gx_status()
  - [x] check_gx_status_with_ok_fn()
- config  
  - Here are the HAL functions
  - [x] gxi_get_feature_value()
  - [x] gxi_set_feature_value()
  - 
  - Following are the raw-wapper functions
  - [x] gxi_get_feature_name()
  - 
  - [x] gxi_get_int_range()
  - [x] gxi_get_int()
  - [x] gxi_set_int()
  - 
  - [x] gxi_get_float_range()
  - [x] gxi_get_float()
  - [x] gxi_set_float()
  - 
  - [x] gxi_get_enum_entry_nums()
  - [x] gxi_get_enum_description()
  - [x] gxi_get_enum()
  - [x] gxi_set_enum()
  -  
  - [x] gxi_get_bool()
  - [x] gxi_set_bool()
  - 
  - [x] gxi_get_string_length()
  - [x] gxi_get_string_max_length()
  - [x] gxi_get_string()
  - [x] gxi_set_string()
  - 
  - [x] gxi_get_buffer_length()
  - [x] gxi_get_buffer()
  - [x] gxi_set_buffer()
- control (Here only the number of functions is listed, the list is too long, so please refer to the [ControlList](./control-list.md) markdown)
  - device             17
  - image_format       27+
  - acquisition        46+
  - digital_io         0      (But MISSING this module's FEATURE_ID)
  - analog             40+ 
  - transport_layer    1 
  - user_set           10 
  - chunk_data         8
- event
  - todo!()
- network
  - todo!() 
