interface LoadingProps {
  autoRetryCount?: number;
  isRetrying?: boolean;
}

export default function Loading({
  autoRetryCount = 0,
  isRetrying = false,
}: LoadingProps) {
  // show a different message if retrying
  if (isRetrying) {
    return <div className="animate-pulse">retrying connection...</div>;
  }

  // show retry count if we've done any automatic retries
  if (autoRetryCount > 0) {
    return <div className="animate-pulse">loading... (maybe refresh?)</div>;
  }

  // default loading state
  return <div className="animate-pulse">loading...</div>;
}
