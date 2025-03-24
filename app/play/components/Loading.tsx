interface LoadingProps {
  autoRetryCount?: number;
  isRetrying?: boolean;
}

export default function Loading({
  autoRetryCount = 0,
  isRetrying = false,
}: LoadingProps) {
  if (isRetrying) {
    return <div className="animate-pulse">retrying connection...</div>;
  }
  if (autoRetryCount > 0) {
    return <div className="animate-pulse">loading...</div>;
  }
  return <div className="animate-pulse">loading...</div>;
}
