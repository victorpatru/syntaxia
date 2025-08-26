import { ErrorComponent, ErrorComponentProps } from "@tanstack/react-router";

export function DefaultCatchBoundary(props: ErrorComponentProps) {
  return <ErrorComponent {...props} />;
}
