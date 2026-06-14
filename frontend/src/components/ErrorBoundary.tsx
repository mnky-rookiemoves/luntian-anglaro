import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '20px',
          color: '#4CAF50',
          backgroundColor: '#0a1a0a',
          minHeight: '100vh',
          fontFamily: 'monospace',
        }}>
          <h2>Luntian encountered an error</h2>
          <p style={{ color: '#EF5350' }}>{this.state.error}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: '' })
              window.location.reload()
            }}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              backgroundColor: '#2E7D32',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Reload App
          </button>
        </div>
      )
    }
    return this.props.children
  }
}