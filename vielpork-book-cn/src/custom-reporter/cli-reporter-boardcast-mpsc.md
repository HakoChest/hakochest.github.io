# 内置使用实例二：CliReporterBoardcastMpsc

`vielpork`提供了一个内置的CLI广播报告器`CliReporterBoardcastMpsc`，用于将下载任务的进度广播到多个mpsc通道。`CliReporterBoardcastMpsc`实现了`ProgressReporter`和`ResultReporter`两个trait，用于向外部报告下载任务的进度和结果。

`CliReporterBoardcastMpsc`使用`tokio::sync::mpsc`来广播下载任务的进度。在下载任务开始时，`CliReporterBoardcastMpsc`会向多个mpsc通道发送进度更新消息，并在下载任务结束时向外部报告下载任务的结果。

这个Reporter的实现比较简单，只需要在`ProgressReporter`和`ResultReporter`的方法中向多个mpsc通道发送消息即可。最开始是用来解决在Tonic gRPC服务器流中，rx类型只能是mpsc，因此我们需要将进度广播到mpsc通道，然后通过服务器将其发送到客户端。

```rust
use crate::error::Result;
use crate::base::traits::{ProgressReporter, ResultReporter};
use crate::base::structs::DownloadProgress;
use crate::base::enums::{ProgressEvent, DownloadResult, OperationType};
use async_trait::async_trait;

#[derive(Debug,Clone)]
pub struct CliReporterBoardcastMpsc{
    inner_tx: tokio::sync::broadcast::Sender<ProgressEvent>,
    buffer_size: usize,
}
impl CliReporterBoardcastMpsc {
    pub fn new(buffer_size: usize) -> Self {
        let (inner_tx, _) = tokio::sync::broadcast::channel(buffer_size);
        Self { inner_tx, buffer_size }
    }

    pub fn subscribe_mpsc(&self) -> tokio::sync::mpsc::Receiver<ProgressEvent> {
        let (tx, rx) = tokio::sync::mpsc::channel(self.buffer_size);
        let mut inner_rx = self.inner_tx.subscribe();
        
        tokio::spawn(async move {
            loop {
                match inner_rx.recv().await {
                    Ok(event) => {
                        if tx.send(event).await.is_err() {
                            break;
                        }
                    }
                    Err(_) => {
                        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
                    }
                }
            }
        });
        
        rx
    }

    // 发送事件的方法
    pub async fn send(&self, event: ProgressEvent) -> Result<usize> {
        self.inner_tx.send(event)?;
        Ok(self.inner_tx.receiver_count())
    }

    // 创建新订阅者
    pub fn subscribe(&self) -> tokio::sync::broadcast::Receiver<ProgressEvent> {
        self.inner_tx.subscribe()
    }
}

#[async_trait]
impl ProgressReporter for CliReporterBoardcastMpsc {
    async fn start_task(&self, task_id: u32, total: u64) ->Result<()> {
        self.send(ProgressEvent::Start { task_id, total }).await?;
        Ok(())
    }

    async fn update_progress(&self, task_id: u32, progress: &DownloadProgress)->Result<()> {
        self.send(ProgressEvent::Update { task_id, progress: progress.clone() }).await?;
        Ok(())
    }

    async fn finish_task(&self, task_id: u32,finish: DownloadResult) ->Result<()>{
        self.send(ProgressEvent::Finish { task_id ,finish}).await?;
        Ok(())
    }
}

#[async_trait]
impl ResultReporter for CliReporterBoardcastMpsc {
    async fn operation_result(&self, operation: OperationType, code: u32, message: String) ->Result<()> {
        self.send(ProgressEvent::OperationResult { operation, code, message }).await?;
        Ok(())
    }
}
```
