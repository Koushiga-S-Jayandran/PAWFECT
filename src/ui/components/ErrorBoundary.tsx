import React, { Component, type ReactNode } from 'react';
import { BowCat } from '../mascots/BowCat';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Feature boundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section
          aria-labelledby="boundary-error-heading"
          className="p-8 my-6 bg-[#FDEBF0] border border-[#F4A8C3] rounded-3xl text-center max-w-xl mx-auto shadow-paw-sm"
        >
          <BowCat size={96} mood="hungry" className="mx-auto mb-4" />
          <h2 id="boundary-error-heading" className="text-xl font-bold text-[#7E1B43] mb-2 font-heading">
            {this.props.fallbackTitle || 'Something paused unexpectedly'}
          </h2>
          <p className="text-sm text-[#8A6B79] mb-4">
            Our shelter friends are looking into it. Your existing cart or gift data has been safely preserved.
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 bg-[#B0285F] text-[#FFF8F6] text-sm font-semibold rounded-full hover:bg-[#7E1B43] transition-colors focus-visible:outline-2"
          >
            Try Refreshing View
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
