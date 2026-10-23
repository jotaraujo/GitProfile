import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../../../src/components/ui/Modal'

describe('Modal', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders when isOpen is true', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Test Content</div>
      </Modal>,
    )
    expect(screen.getByText('Test Content')).toBeDefined()
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('does not render when isOpen is false', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={false} onClose={onClose}>
        <div>Test Content</div>
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('calls onClose when clicking outside', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Test Content</div>
      </Modal>,
    )
    const backdrop = screen.getByRole('dialog').firstChild as HTMLElement
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when pressing Escape key', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Test Content</div>
      </Modal>,
    )
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows title when provided', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title='Test Modal'>
        <div>Test Content</div>
      </Modal>,
    )
    expect(screen.getByText('Test Modal')).toBeDefined()
  })

  it('does not show title when not provided', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Test Content</div>
      </Modal>,
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} className='custom-modal'>
        <div>Test Content</div>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('custom-modal')
  })

  it('applies aria attributes correctly', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title='Test Modal'>
        <div>Test Content</div>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
  })

  it('is accessible with proper ARIA roles', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title='Test Modal'>
        <div role='form'>Test Content</div>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('role', 'dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })
})