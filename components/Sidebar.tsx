'use client'

import { useState } from 'react'
import styles from './Sidebar.module.css'

type ViewMode = 'anatomy' | 'exercises' | 'formulas' | 'guides' | 'workouts'

interface SidebarProps {
  data: {
    nodes: any[]
    exercises: any[]
    formulas: any[]
    guides: any[]
    workouts: any[]
  }
}

export function Sidebar({ data }: SidebarProps) {
  const [activeView, setActiveView] = useState<ViewMode>('anatomy')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [collapsed, setCollapsed] = useState(false)

  const views: { key: ViewMode; label: string; icon: string; count: number }[] = [
    { key: 'anatomy', label: 'Anatomy', icon: '🦴', count: data.nodes.length },
    { key: 'exercises', label: 'Exercises', icon: '🏋️', count: data.exercises.length },
    { key: 'formulas', label: 'Formulas', icon: '⚗️', count: data.formulas.length },
    { key: 'guides', label: 'Guides', icon: '📖', count: data.guides.length },
    { key: 'workouts', label: 'Workouts', icon: '💪', count: data.workouts.length },
  ]

  const renderList = () => {
    switch (activeView) {
      case 'anatomy':
        const roots = data.nodes.filter(n => !n.parentId)
        return <AnatomyTree nodes={data.nodes} roots={roots} onSelect={setSelectedItem} selected={selectedItem} />
      case 'exercises':
        return (
          <div className={styles.list}>
            {data.exercises.map(ex => (
              <div
                key={ex.id}
                className={`${styles.listItem} ${selectedItem?.id === ex.id ? styles.selected : ''}`}
                onClick={() => setSelectedItem(ex)}
              >
                <span className={styles.itemType}>{ex.type}</span>
                <span className={styles.itemName}>{ex.name}</span>
              </div>
            ))}
          </div>
        )
      case 'formulas':
        return (
          <div className={styles.list}>
            {data.formulas.map(f => (
              <div
                key={f.id}
                className={`${styles.listItem} ${selectedItem?.id === f.id ? styles.selected : ''}`}
                onClick={() => setSelectedItem(f)}
              >
                <span className={styles.itemType}>{f.pattern}</span>
                <span className={styles.itemName}>{f.name}</span>
              </div>
            ))}
          </div>
        )
      case 'guides':
        return (
          <div className={styles.list}>
            {data.guides.map(g => (
              <div
                key={g.id}
                className={`${styles.listItem} ${selectedItem?.id === g.id ? styles.selected : ''}`}
                onClick={() => setSelectedItem(g)}
              >
                <span className={styles.itemName}>{g.title}</span>
                <span className={styles.itemMeta}>{g.sections.length} sections</span>
              </div>
            ))}
          </div>
        )
      case 'workouts':
        return (
          <div className={styles.list}>
            {data.workouts.map(w => (
              <div
                key={w.id}
                className={`${styles.listItem} ${selectedItem?.id === w.id ? styles.selected : ''}`}
                onClick={() => setSelectedItem(w)}
              >
                <span className={styles.itemName}>{w.name}</span>
                <span className={styles.itemMeta}>{w.blocks.length} blocks</span>
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>🐍</span>
          {!collapsed && <span>Rommy</span>}
        </h1>
        <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {!collapsed && (
        <>
          <nav className={styles.nav}>
            {views.map(v => (
              <button
                key={v.key}
                className={`${styles.navBtn} ${activeView === v.key ? styles.active : ''}`}
                onClick={() => { setActiveView(v.key); setSelectedItem(null) }}
              >
                <span className={styles.navIcon}>{v.icon}</span>
                <span className={styles.navLabel}>{v.label}</span>
                <span className={styles.navCount}>{v.count}</span>
              </button>
            ))}
          </nav>

          <div className={styles.content}>
            {renderList()}
          </div>

          {selectedItem && (
            <div className={styles.detailPanel}>
              <DetailView item={selectedItem} view={activeView} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function AnatomyTree({ nodes, roots, onSelect, selected, level = 0 }: any) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getChildren = (parentId: string) => nodes.filter((n: any) => n.parentId === parentId)
  const kindColors: Record<string, string> = {
    region: '#ff6b35',
    group: '#aa55ff',
    muscle: '#00fff5',
    part: '#00ff88',
  }

  return (
    <div className={styles.tree}>
      {roots.map((node: any) => {
        const children = getChildren(node.id)
        const hasChildren = children.length > 0
        const isExpanded = expanded[node.id]

        return (
          <div key={node.id} className={styles.treeNode}>
            <div
              className={`${styles.treeItem} ${selected?.id === node.id ? styles.selected : ''}`}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
              onClick={() => onSelect(node)}
            >
              {hasChildren && (
                <button className={styles.expandBtn} onClick={(e) => { e.stopPropagation(); toggle(node.id) }}>
                  {isExpanded ? '▼' : '▶'}
                </button>
              )}
              {!hasChildren && <span className={styles.expandBtn} style={{ visibility: 'hidden' }}>▶</span>}
              <span className={styles.kindDot} style={{ background: kindColors[node.kind] || '#666' }} />
              <span className={styles.nodeName}>{node.name}</span>
            </div>
            {hasChildren && isExpanded && (
              <AnatomyTree nodes={nodes} roots={children} onSelect={onSelect} selected={selected} level={level + 1} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function DetailView({ item, view }: { item: any; view: ViewMode }) {
  return (
    <div className={styles.detail}>
      <h3 className={styles.detailTitle}>{item.name || item.title}</h3>
      {item.kind && <span className={styles.detailBadge}>{item.kind}</span>}
      {item.type && <span className={styles.detailBadge}>{item.type}</span>}
      {item.pattern && <span className={styles.detailBadge}>{item.pattern}</span>}
      
      {item.description && (
        <p className={styles.detailDesc}>{item.description}</p>
      )}
      {item.roleSummary && (
        <p className={styles.detailDesc}>{item.roleSummary}</p>
      )}
      {item.cueSummary && (
        <p className={styles.detailDesc}>{item.cueSummary}</p>
      )}
      {item.goal && (
        <p className={styles.detailDesc}>{item.goal}</p>
      )}

      {item.primaryFunctions && (
        <div className={styles.detailSection}>
          <h4>Functions</h4>
          <ul>
            {JSON.parse(item.primaryFunctions).map((f: string, i: number) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {item.aestheticNotes && (
        <div className={styles.detailSection}>
          <h4>Aesthetics</h4>
          <ul>
            {JSON.parse(item.aestheticNotes).map((n: string, i: number) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {item.steps && (
        <div className={styles.detailSection}>
          <h4>Steps</h4>
          <ol>
            {item.steps.map((s: any) => (
              <li key={s.id}>
                <strong>{s.exercise.name}</strong> ({s.role})
                {s.notes && <span className={styles.stepNote}> — {s.notes}</span>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {item.blocks && (
        <div className={styles.detailSection}>
          <h4>Blocks</h4>
          {item.blocks.map((b: any) => (
            <div key={b.id} className={styles.blockItem}>
              <strong>{b.label}</strong>
              <p className={styles.blockScheme}>{b.schemeStyle}</p>
            </div>
          ))}
        </div>
      )}

      {item.sections && (
        <div className={styles.detailSection}>
          <h4>Sections</h4>
          <ol>
            {item.sections.map((s: any) => (
              <li key={s.id}>{s.title}</li>
            ))}
          </ol>
        </div>
      )}

      {item.videoUrl && (
        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
          🎬 Watch Video
        </a>
      )}
    </div>
  )
}

