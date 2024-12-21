# 简介

GXCI是基于Rust的大恒相机API上层封装

## 模块

主要分为四大模块：
1. HAL API：基于RAW Wrapper的为具体功能而作高级封装
2. RAW Wrapper：GxIAPI.dll的直接Rust封装，提供原生API调用
3. Utils：一些工具函数
4. Error Handling：统一错误处理

## 特性

目前有四个Features：
- solo：单相机模式
- use-opencv：使用opencv库
- （开发中）multi模式：多相机模式
- （开发中）use-imageproc：使用imageproc库

默认开启的是solo和use-opencv

## 说白了

raw就是用大恒相机给的C语言开发用的GXIAPI.dll,结合开发文档，用libloading这个库把dll的所有函数加载进来封装了一层。然后此外每个对应的类型、结构体、枚举、常量等等都重新用rust写了一遍。特别是枚举描述部分还遇到过结构体内存没对齐的问题。

hal最主要做的其实就是给GX_INSTANCE、DEVICE_HANDLE这些在库内部用全局变量封装了一层，在调库的时候就不用每次let一个gx出来然后调gx的方法。

但其实全局变量封装目前用的还是std的Mutex（典中典`LazyLock<Arc<Mutex<T>>>`），暂时还没引入tokio（毕竟手头也只有一个相机，前端那边也还没有多相机的业务）

utils写的一坨狗屎，乱成一堆，开始写的时候项目水平还很差是怎样的，但也暂时懒得改了

error部分挺好的，还是喜欢原生Error Handling