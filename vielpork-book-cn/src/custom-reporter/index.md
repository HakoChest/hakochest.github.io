# 自定义Reporter

在`vielpork`中，Reporter是一个用于向外部报告下载任务进度和结果的接口。Reporter由两个trait构成，他们定义了一系列的方法，用于向外部报告下载任务的进度和结果。Reporter的实现可以是任何类型，只要它实现了这两个Reporter trait即可。

在`vielport::base::traits`中定义的这两个trait是`ProgressReporter`和`ResultReporter`。`ProgressReporter`定义了三个方法，用于报告下载任务的开始、进度更新和结束。`ResultReporter`定义了一个方法，用于报告下载任务的结果。

```rust
#[async_trait]
pub trait ProgressReporter
{
    async fn start_task(&self, task_id: u32, total: u64) -> Result<()>;
    async fn update_progress(&self, task_id: u32, progress: &DownloadProgress) -> Result<()>;
    async fn finish_task(&self, task_id: u32, result: DownloadResult) -> Result<()>;
}

#[async_trait]
pub trait ResultReporter
{
    async fn operation_result(&self, operation: OperationType, code: u32, message: String) -> Result<()>;
}

pub trait CombinedReporter: ProgressReporter + ResultReporter + Send + Sync {}
impl<T: ProgressReporter + ResultReporter + Send + Sync> CombinedReporter for T {}

```
