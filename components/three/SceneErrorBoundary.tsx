"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import WebGLFallback from "./WebGLFallback";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SceneErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Three.js/R3F render crash captured by Boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <WebGLFallback />;
    }

    return this.props.children;
  }
}
export default SceneErrorBoundary;
