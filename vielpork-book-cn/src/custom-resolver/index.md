# 自定义Resolver

在`vielpork`中，`Resolver`是一个trait，用于解析资源的来源。`vielpork`提供了一个内置的`UrlResolver`，用于从URL下载资源。您可以通过实现`Resolver` trait来自定义解析逻辑。

在`vielport::base::traits`中定义的这个trait是`ResourceResolver`。`ResourceResolver`定义了一个方法，用于解析资源的来源。

```rust
#[async_trait]
pub trait ResourceResolver: Send + Sync {
    async fn resolve(&self, resource: &DownloadResource) -> Result<ResolvedResource>;
}
```

## Resolver何为？

`Resolver`用来将`DownloadResource`转换为`ResolvedResource`。`DownloadResource`是一个枚举类型，它包含了资源的不同类型。`ResolvedResource`是一个结构体，它包含了HTTP请求所需的详细信息。

```rust
// `vielpork::base::enums`中定义的`DownloadResource`枚举类型

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
// `vielpork::base::structs`中定义的`ResolvedResource`结构体
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResolvedResource {
    pub id: u32,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub auth: Option<AuthMethod>,
}
```

其中，`AuthMethod`支持`Basic`、`Bearer`以及`ApiKey`三种认证方式。

```rust
// `vielpork::base::enums`中定义的`AuthMethod`枚举类型

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum AuthMethod {
    None,
    Basic { username: String, password: String },
    Bearer { token: String },
    ApiKey { key: String, header: String },
}
```
