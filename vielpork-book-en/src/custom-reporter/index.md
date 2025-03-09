# Custom Reporter

In `vielpork`, Reporter is an interface used to report the progress and results of download tasks to the outside. Reporter consists of two traits, which define a series of methods for reporting the progress and results of download tasks to the outside. The implementation of Reporter can be any type, as long as it implements these two Reporter traits.

The two traits defined in `vielport::base::traits` are `ProgressReporter` and `ResultReporter`. `ProgressReporter` defines three methods for reporting the start, progress update, and end of download tasks. `ResultReporter` defines a method for reporting the result of download tasks.

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
