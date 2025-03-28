# 外部使用实例一：OsuBeatmapResolver

这一部分可以详见[osynic_downloader](https://crates.io/crates/osynic_downloader)的源码。

`osynic_downloader`是一个基于`vielpork`的osu!谱面下载器，包含工具库和TUI应用。

它使用的Resolver是`OsuBeatmapResolver`，这个Resolver是一个从osu!官网、API以及各打镜像站下载谱面的资源解析器。

例如：

- 对于Url类型的资源，直接返回Url；
- 对于Id类型的资源，根据Id生成Url，使用默认的下载源；
- 对于Params类型的资源，根据参数生成Url，使用参数指定的下载源；
- 对于HashMap类型的资源，根据HashMap生成Url，使用参数指定的下载源。

```rust
use vielpork::base::traits::ResourceResolver;
use vielpork::base::structs::ResolvedResource;
use vielpork::base::enums::{DownloadResource,AuthMethod};
use vielpork::base::algorithms::generate_task_id;
use async_trait::async_trait;

use crate::sources::{DownloadSource, DownloadSourceType};
use crate::url::form_url;

#[derive(Debug,Clone)]
pub struct OsuBeatmapsetResolver {}

impl OsuBeatmapsetResolver {
    pub fn new() -> Self {
        Self {}
    }
}

#[async_trait]
impl ResourceResolver for OsuBeatmapsetResolver {
    async fn resolve(&self, resource: &DownloadResource) -> vielpork::error::Result<ResolvedResource> {
        match resource {
            DownloadResource::Url(url) => {
                Ok(ResolvedResource{
                    id: generate_task_id(url),
                    url: url.clone(),
                    headers: vec![],
                    auth: None,
                })
            }
            DownloadResource::Id(id) => {
                let beatmapset_id: u32;
                match id.parse::<u32>() {
                    Ok(id) => {
                        beatmapset_id = id;
                    }
                    Err(_) => {
                        return Err("Invalid beatmapset id".into());
                    }
                }
                let download_source = DownloadSource::from(DownloadSourceType::Default);
                let base_url = download_source.base_url.clone();
                let url = form_url(&base_url, &beatmapset_id, "", "").map_err(|e| e.to_string())?;
                Ok(ResolvedResource{
                    id: beatmapset_id,
                    url: url.clone(),
                    headers: vec![],
                    auth: None,
                })
            }
            DownloadResource::Params(params) => {
                let beatmapset_id: u32;
                let source: String;

                match params.get(0) {
                    Some(id) => {
                        match id.parse::<u32>() {
                            Ok(id) => {
                                beatmapset_id = id;
                            }
                            Err(_) => {
                                return Err("Invalid beatmapset id".into());
                            }
                        }
                    }
                    None => {
                        return Err("Missing beatmapset_id".into());
                    }
                }
                match params.get(1) {
                    Some(src) => {
                        source = src.clone();
                    }
                    None => {
                        return Err("Missing source".into());
                    }
                }
                let download_source = DownloadSource::from(DownloadSourceType::from(source));
                let base_url = download_source.base_url.clone();

                let username: String;
                let password: String;

                let url: String;
                if download_source.requires_osu_credentials {
                    match params.get(2) {
                        Some(name) => {
                            username = name.clone();
                        }
                        None => {
                            return Err("Missing username".into());
                        }
                    }
                    match params.get(3) {
                        Some(pass) => {
                            password = pass.clone();
                        }
                        None => {
                            return Err("Missing password".into());
                        }
                    }
                    if download_source.requires_basic_auth{
                        url = form_url(&base_url, &beatmapset_id, "","").map_err(|e| e.to_string())?;
                        Ok(
                            ResolvedResource{
                                id:beatmapset_id,
                                url: url.clone(),
                                headers: vec![],
                                auth: Some(AuthMethod::Basic { username, password }),
                            }
                        )
                    } else {
                        let hashed_password = format!("{:x}", md5::compute(password));
                        url = form_url(&base_url, &beatmapset_id, &username, &hashed_password).map_err(|e| e.to_string())?;
                        Ok(
                            ResolvedResource{
                                id:beatmapset_id,
                                url: url.clone(),
                                headers: vec![],
                                auth: None,
                            }
                        )
                    }
                } else {
                    url = form_url(&base_url, &beatmapset_id, "", "").map_err(|e| e.to_string())?;
                    Ok(
                        ResolvedResource{
                            id:beatmapset_id,
                            url: url.clone(),
                            headers: vec![],
                            auth: None,
                        }
                    )
                }

            }
            DownloadResource::HashMap(hashmap) => {
                let beatmapset_id: u32;
                let source: String;
                match hashmap.get("beatmapset_id") {
                    Some(id) => {
                        match id.parse::<u32>() {
                            Ok(id) => {
                                beatmapset_id = id;
                            }
                            Err(_) => {
                                return Err("Invalid beatmapset id".into());
                            }
                        }
                    }
                    None => {
                        return Err("Missing beatmapset_id".into());
                    }
                }
                match hashmap.get("source") {
                    Some(src) => {
                        source = src.clone();
                    }
                    None => {
                        return Err("Missing source".into());
                    }
                }
                let download_source = DownloadSource::from(DownloadSourceType::from(source));
                let base_url = download_source.base_url.clone();

                let username: String;
                let password: String;

                let url: String;
                if download_source.requires_osu_credentials {
                    match hashmap.get("username") {
                        Some(name) => {
                            username = name.clone();
                        }
                        None => {
                            return Err("Missing username".into());
                        }
                    }
                    match hashmap.get("password") {
                        Some(pass) => {
                            password = pass.clone();
                        }
                        None => {
                            return Err("Missing password".into());
                        }
                    }
                    if download_source.requires_basic_auth{
                        url = form_url(&base_url, &beatmapset_id, "","").map_err(|e| e.to_string())?;
                        Ok(
                            ResolvedResource{
                                id:beatmapset_id,
                                url: url.clone(),
                                headers: vec![],
                                auth: Some(AuthMethod::Basic { username, password }),
                            }
                        )
                    } else {
                        let hashed_password = format!("{:x}", md5::compute(password));
                        url = form_url(&base_url, &beatmapset_id, &username, &hashed_password).map_err(|e| e.to_string())?;
                        Ok(
                            ResolvedResource{
                                id:beatmapset_id,
                                url: url.clone(),
                                headers: vec![],
                                auth: None,
                            }
                        )
                    }
                } else {
                    url = form_url(&base_url, &beatmapset_id, "", "").map_err(|e| e.to_string())?;
                    Ok(
                        ResolvedResource{
                            id:beatmapset_id,
                            url: url.clone(),
                            headers: vec![],
                            auth: None,
                        }
                    )
                }                
            }
            DownloadResource::Resolved(resolved) => {
                Ok(resolved.clone())
            }
        }
    }
}

```
