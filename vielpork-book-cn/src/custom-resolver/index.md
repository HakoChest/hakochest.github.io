# 自定义Resolver

在`vielpork`中，`Resolver`是一个trait，用于解析资源的来源。`vielpork`提供了一个内置的`UrlResolver`，用于从URL下载资源。您可以通过实现`Resolver` trait来自定义解析逻辑。

在`vielport::base::traits`中定义的这个trait是`ResourceResolver`。`ResourceResolver`定义了一个方法，用于解析资源的来源。

```rust
#[async_trait]
pub trait ResourceResolver: Send + Sync {
    async fn resolve(&self, resource: &DownloadResource) -> Result<ResolvedResource>;
}
```
