import { Component } from 'react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-primary min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <p className="font-mono text-gold text-6xl font-medium mb-4">Oops</p>
            <div className="w-16 h-px bg-gold mx-auto mb-8" />
            <h2 className="font-display text-3xl text-text-primary mb-3">
              Something went wrong
            </h2>
            <p className="font-body text-text-secondary mb-8 text-sm">
              An unexpected error occurred. Please try again.
            </p>
            <Link to="/" className="btn-primary" onClick={() => this.setState({ hasError: false })}>
              Back to Home
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary