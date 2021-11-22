# xiao

> **DNS checker for organization urls, made in Rust.**

## How does it work?

> :warning: Xiao requires Redis and Kafka to be running before doing anything.

Since Xiao is a consumer from the producer (which is **Tsubaki**), it'll receive events on when organization URLs are updated and pushed to the Xiao queue. In which, it will run every 5 seconds to check if the DNS record exists and it'll be verified, somewhat like GitHub.
