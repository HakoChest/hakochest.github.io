# 内置使用实例一：UrlResolver

`UrlResolver`是一个简单的解析器，用于从URL下载资源。

实际上，`UrlResolver`只是一个简单的reqwest包装器，它将URL转换为`ResolvedResource`。

```rust

use crate::error::Result;
use crate::base::traits::ResourceResolver;
use crate::base::structs::ResolvedResource;
use crate::base::enums::DownloadResource;
use crate::base::algorithms::generate_task_id;
use async_trait::async_trait;

#[derive(Debug,Clone)]
pub struct UrlResolver {}

impl UrlResolver {
    pub fn new() -> Self {
        Self {}
    }
}

#[async_trait]
impl ResourceResolver for UrlResolver {
    async fn resolve(&self, resource: &DownloadResource) -> Result<ResolvedResource> {
        match resource {
            DownloadResource::Url(url) => {
                Ok(ResolvedResource{
                    id: generate_task_id(url),
                    url: url.clone(),
                    headers: vec![],
                    auth: None,
                })
            }
            DownloadResource::Resolved(resolved) => {
                Ok(resolved.clone())
            }
            _ => {
                Err("Unsupported resource type".into())
            }
        }
    }
}
```
