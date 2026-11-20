import { Component, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import { brand } from '../brand.js';

export function EmptyState({ title, body, icon: Icon = BookOpen, children }) {
  return <div className="empty-state"><span className="empty-state-icon"><Icon size={22} /></span><b>{title}</b><p>{body}</p>{children}</div>;
}

export function BrandMark({ className = '', size = 38 }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <defs><linearGradient id="gu-mark-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#17305a" /><stop offset="1" stopColor="#0b1730" /></linearGradient></defs>
    <rect width="64" height="64" rx="16" fill="url(#gu-mark-bg)" />
    <path d="M40.5 22.5A13 13 0 1 0 45 32H33" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="47.5" cy="16.5" r="4.5" fill="#14b8a6" />
  </svg>;
}

export function LoadingState({ label = 'Loading…' }) {
  return <div className="panel muted-state loading-state" role="status" aria-live="polite">
    <div className="loading-label"><span className="spinner" aria-hidden="true" />{label}</div>
    <div className="skeleton-lines" aria-hidden="true"><span className="skeleton" /><span className="skeleton" /><span className="skeleton skeleton-short" /></div>
  </div>;
}

export function ErrorNotice({ error, onRetry }) {
  if (!error) return null;
  return <div className="inline-error" role="alert"><span>{error}</span>{onRetry && <button type="button" onClick={onRetry}>Try again</button>}</div>;
}

export function StatusPill({ children }) {
  return <span className={`status-pill status-${String(children).toLowerCase().replaceAll(' ', '-')}`}>{children}</span>;
}

export function Modal({ title, kicker = brand.name.toUpperCase(), onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`modal-card ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-heading"><div><span className="section-overline">{kicker}</span><h2>{title}</h2></div><button type="button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>
      {children}
    </section>
  </div>;
}

export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidUpdate(previous) { if (previous.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null }); }
  render() {
    if (!this.state.error) return this.props.children;
    return <div className="subpage"><div className="panel"><EmptyState title="Something went wrong on this page" body="The rest of the workspace still works. Try reloading, or open another page from the menu."><button className="button-primary" onClick={() => window.location.reload()}>Reload page</button></EmptyState></div></div>;
  }
}
