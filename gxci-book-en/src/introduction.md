# Introduction

GXCI is a high-level encapsulation based on the Rust of the Daheng camera API

## Modules

It is mainly divided into four modules:
1. HAL API: High-level encapsulation based on RAW Wrapper for specific functions
2. RAW Wrapper: Direct Rust encapsulation of GxIAPI.dll, providing native API calls
3. Utils: Some utility functions
4. Error Handling: Unified error handling

## Features

There are currently four Features:
- solo: Single camera mode
- use-opencv: Use the opencv library
- (under development) multi-mode: Multi-camera mode
- (under development) use-imageproc: Use the imageproc library

The default is solo and use-opencv
