"use client"

import React from "react"

export default function Modal({ open, onClose, title, children, top = false }) {
  if (!open) return null
  const containerStyle = top
    ? { position: "fixed", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", zIndex: 2000, paddingTop: 12 }
    : { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }

  return (
    <div style={containerStyle}>
      <div style={{ width: 920, maxWidth: "95%" }} className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}
        >
          <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
          <button onClick={onClose} className="btn" style={{ padding: "8px 12px", fontSize: 13 }}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
