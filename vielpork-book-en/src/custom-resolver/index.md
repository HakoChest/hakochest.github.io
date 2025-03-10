# Custom Resolver

In `vielpork`, `Resolver` is a trait used to resolve the source of resources. `vielpork` provides a built-in `UrlResolver` for downloading resources from URLs. You can customize the resolution logic by implementing the `Resolver` trait.

The trait defined in `vielport::base::traits` is `ResourceResolver`. `ResourceResolver` defines a method for resolving the source of resources.

```rust
#[async_trait]
pub trait ResourceResolver: Send + Sync {
    async fn resolve(&self, resource: &DownloadResource) -> Result<ResolvedResource>;
}
```

## What Are Resolvers For?

`Resolver` is used to convert `DownloadResource` to `ResolvedResource`. `DownloadResource` is an enum type that contains different types of resources. `ResolvedResource` is a struct that contains detailed information required for an HTTP request.

```rust
// The `DownloadResource` enum type defined in `vielpork::base::enums`

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DownloadResource {
    Url(String),
    Id(String), 
    Params(Vec<String>),
    HashMap(HashMap<String, String>),
    Resolved(ResolvedResource),
}
```

```rust
// The `ResolvedResource` struct defined in `vielpork::base::structs`
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResolvedResource {
    pub id: u32,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub auth: Option<AuthMethod>,
}
```

In this context, `AuthMethod` supports three authentication methods: `Basic`, `Bearer`, and`ApiKey`.

```rust
// The `AuthMethod` enum type defined in `vielpork::base::enums`

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum AuthMethod {
    None,
    Basic { username: String, password: String },
    Bearer { token: String },
    ApiKey { key: String, header: String },
}
```
