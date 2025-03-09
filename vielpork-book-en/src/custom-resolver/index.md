# Custom Resolver

In `vielpork`, `Resolver` is a trait used to resolve the source of resources. `vielpork` provides a built-in `UrlResolver` for downloading resources from URLs. You can customize the resolution logic by implementing the `Resolver` trait.

The trait defined in `vielport::base::traits` is `ResourceResolver`. `ResourceResolver` defines a method for resolving the source of resources.

```rust
#[async_trait]
pub trait ResourceResolver: Send + Sync {
    async fn resolve(&self, resource: &DownloadResource) -> Result<ResolvedResource>;
}
```
