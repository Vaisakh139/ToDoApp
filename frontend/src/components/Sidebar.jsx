import { useState, useEffect, useRef } from 'react'

function EllipsisIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="currentColor">
      <circle cx="12" cy="5"  r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  )
}

function CategoryItem({ cat, isSelected, onSelect, onRename, onDelete }) {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [editing,   setEditing]   = useState(false)
  const [editName,  setEditName]  = useState(cat.name)
  const menuRef  = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function close(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function startEdit() {
    setEditName(cat.name)
    setEditing(true)
    setMenuOpen(false)
  }

  function submitEdit(e) {
    e?.preventDefault()
    const name = editName.trim()
    if (name && name !== cat.name) onRename(cat.id, name)
    setEditing(false)
  }

  function cancelEdit() {
    setEditName(cat.name)
    setEditing(false)
  }

  return (
    <li
      className={`cat-item${isSelected ? ' active' : ''}`}
      onClick={() => !editing && onSelect(cat.id)}
    >
      {editing ? (
        <form className="cat-edit-form" onSubmit={submitEdit} onClick={e => e.stopPropagation()}>
          <input
            ref={inputRef}
            className="cat-edit-input"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            maxLength={40}
            onKeyDown={e => e.key === 'Escape' && cancelEdit()}
            onBlur={submitEdit}
          />
        </form>
      ) : (
        <>
          <span className="cat-name">{cat.name}</span>
          <div className="cat-menu-wrap" ref={menuRef} onClick={e => e.stopPropagation()}>
            <button
              className="cat-ellipsis"
              title="Options"
              onClick={() => setMenuOpen(o => !o)}
            >
              <EllipsisIcon />
            </button>
            {menuOpen && (
              <div className="cat-dropdown">
                <button className="cat-dd-item" onClick={startEdit}>Rename</button>
                <button className="cat-dd-item cat-dd-delete" onClick={() => { setMenuOpen(false); onDelete(cat.id) }}>Delete</button>
              </div>
            )}
          </div>
        </>
      )}
    </li>
  )
}

export default function Sidebar({ categories, selectedId, onSelect, onAdd, onRename, onDelete }) {
  const [newName, setNewName] = useState('')
  const [adding, setAdding]   = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setAdding(true)
    await onAdd(name)
    setNewName('')
    setAdding(false)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Categories</div>

      <ul className="cat-list">
        <li
          className={`cat-item${selectedId === null ? ' active' : ''}`}
          onClick={() => onSelect(null)}
        >
          <span className="cat-name">All Tasks</span>
        </li>

        {categories.map(cat => (
          <CategoryItem
            key={cat.id}
            cat={cat}
            isSelected={selectedId === cat.id}
            onSelect={onSelect}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
      </ul>

      {categories.length < 8 ? (
        <form className="cat-add-form" onSubmit={handleAdd}>
          <input
            className="cat-input"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="New category…"
            maxLength={40}
          />
          <button
            type="submit"
            className="cat-add-btn"
            disabled={adding || !newName.trim()}
          >
            {adding ? '…' : '+'}
          </button>
        </form>
      ) : (
        <p className="cat-limit-msg">Maximum 8 categories reached.</p>
      )}
    </aside>
  )
}
