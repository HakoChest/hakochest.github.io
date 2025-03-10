# Internal Usage Example One: UrlResolver

`UrlResolver` is a simple resolver that downloads resources from a URL.

In fact, `UrlResolver` is just a simple reqwest wrapper that converts a URL to a `ResolvedResource`.

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
