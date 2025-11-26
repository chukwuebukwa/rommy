'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  MarkerType,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { CustomNode } from './CustomNode'
import styles from './AnatomyGraph.module.css'

type ViewFilter = 'all' | 'region' | 'group' | 'muscle' | 'part'

interface AnatomyGraphProps {
  nodes: any[]
  exercises: any[]
}

const nodeTypes = {
  anatomy: CustomNode,
  exercise: CustomNode,
}

const kindColors: Record<string, { bg: string; border: string; text: string }> = {
  region: { bg: '#1a0f0a', border: '#ff6b35', text: '#ff6b35' },
  group: { bg: '#150a1a', border: '#aa55ff', text: '#aa55ff' },
  muscle: { bg: '#0a1a1a', border: '#00fff5', text: '#00fff5' },
  part: { bg: '#0a1a10', border: '#00ff88', text: '#00ff88' },
  exercise: { bg: '#1a1a0a', border: '#ffdd00', text: '#ffdd00' },
}

function AnatomyGraphInner({ nodes: anatomyNodes, exercises }: AnatomyGraphProps) {
  const [filter, setFilter] = useState<ViewFilter>('all')
  const [showExercises, setShowExercises] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const { fitView } = useReactFlow()

  const { nodes, edges } = useMemo(() => {
    const flowNodes: Node[] = []
    const flowEdges: Edge[] = []
    const positions = new Map<string, { x: number; y: number }>()

    // Filter nodes based on filter
    let filteredNodes = anatomyNodes
    if (filter !== 'all') {
      // Include the filtered kind + all ancestors
      const kindNodes = anatomyNodes.filter(n => n.kind === filter)
      const ancestorIds = new Set<string>()
      
      const findAncestors = (nodeId: string) => {
        const node = anatomyNodes.find((n: any) => n.id === nodeId)
        if (node?.parentId) {
          ancestorIds.add(node.parentId)
          findAncestors(node.parentId)
        }
      }
      
      kindNodes.forEach((n: any) => findAncestors(n.id))
      filteredNodes = anatomyNodes.filter((n: any) => n.kind === filter || ancestorIds.has(n.id))
    }

    // Position nodes hierarchically
    const roots = filteredNodes.filter((n: any) => !n.parentId || !filteredNodes.find((fn: any) => fn.id === n.parentId))
    const levelWidth = 350
    const nodeHeight = 120

    const positionSubtree = (nodeId: string, x: number, y: number, availableWidth: number): number => {
      const node = filteredNodes.find((n: any) => n.id === nodeId)
      if (!node) return y

      const children = filteredNodes.filter((n: any) => n.parentId === nodeId)
      
      if (children.length === 0) {
        positions.set(nodeId, { x, y })
        return y + nodeHeight
      }

      let currentY = y
      const childWidth = availableWidth / Math.max(children.length, 1)
      
      children.forEach((child: any, idx: number) => {
        const childX = x + levelWidth
        currentY = positionSubtree(child.id, childX, currentY, childWidth)
      })

      // Position parent in the middle of its children
      const childPositions = children.map((c: any) => positions.get(c.id)?.y || 0)
      const avgY = childPositions.reduce((a, b) => a + b, 0) / childPositions.length
      positions.set(nodeId, { x, y: avgY })

      return currentY
    }

    let currentY = 50
    roots.forEach((root: any, idx: number) => {
      currentY = positionSubtree(root.id, 50, currentY, 1000)
      currentY += 80
    })

    // Create flow nodes
    filteredNodes.forEach((node: any) => {
      const pos = positions.get(node.id) || { x: 0, y: 0 }
      const colors = kindColors[node.kind] || kindColors.muscle

      flowNodes.push({
        id: node.id,
        type: 'anatomy',
        position: pos,
        data: {
          label: node.name,
          kind: node.kind,
          description: node.description || node.roleSummary,
          colors,
          selected: selectedNode === node.id,
        },
      })

      // Create edges to children
      const children = filteredNodes.filter((n: any) => n.parentId === node.id)
      children.forEach((child: any) => {
        flowEdges.push({
          id: `${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: kindColors[child.kind]?.border || '#444',
            strokeWidth: 2,
            opacity: 0.6,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: kindColors[child.kind]?.border || '#444',
          },
        })
      })
    })

    // Add exercise nodes if enabled
    if (showExercises && selectedNode) {
      const relatedExercises = exercises.filter((ex: any) =>
        ex.anatomyLinks.some((link: any) => link.anatomyNodeId === selectedNode)
      )

      const selectedPos = positions.get(selectedNode)
      if (selectedPos) {
        relatedExercises.forEach((ex: any, idx: number) => {
          const exId = `ex-${ex.id}`
          const angle = (idx / relatedExercises.length) * Math.PI * 2
          const radius = 200

          flowNodes.push({
            id: exId,
            type: 'exercise',
            position: {
              x: selectedPos.x + Math.cos(angle) * radius,
              y: selectedPos.y + Math.sin(angle) * radius + 200,
            },
            data: {
              label: ex.name,
              kind: 'exercise',
              description: ex.cueSummary,
              colors: kindColors.exercise,
            },
          })

          const link = ex.anatomyLinks.find((l: any) => l.anatomyNodeId === selectedNode)
          flowEdges.push({
            id: `${selectedNode}-${exId}`,
            source: selectedNode,
            target: exId,
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: link?.role === 'primary' ? '#00ff88' : '#ffdd00',
              strokeWidth: 2,
              strokeDasharray: link?.role === 'primary' ? 'none' : '5,5',
            },
            label: link?.role || '',
            labelStyle: { fill: '#888', fontSize: 10 },
            labelBgStyle: { fill: '#1a1a26', fillOpacity: 0.8 },
          })
        })
      }
    }

    return { nodes: flowNodes, edges: flowEdges }
  }, [anatomyNodes, exercises, filter, showExercises, selectedNode])

  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes)
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges)

  // Update when dependencies change
  useEffect(() => {
    setNodes(nodes)
    setEdges(edges)
    // Fit view after nodes are set
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 200 })
    }, 100)
  }, [nodes, edges, setNodes, setEdges, fitView])

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(prev => prev === node.id ? null : node.id)
  }, [])

  const filters: { key: ViewFilter; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: '#888' },
    { key: 'region', label: 'Regions', color: '#ff6b35' },
    { key: 'group', label: 'Groups', color: '#aa55ff' },
    { key: 'muscle', label: 'Muscles', color: '#00fff5' },
    { key: 'part', label: 'Parts', color: '#00ff88' },
  ]

  return (
    <div className={styles.graphContainer}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#333344" gap={20} size={2} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const kind = node.data?.kind as string
            return kindColors[kind]?.border || '#666'
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
        />

        <Panel position="top-left" className={styles.controlPanel}>
          <div className={styles.debugInfo}>
            <strong>{flowNodes.length}</strong> nodes • <strong>{flowEdges.length}</strong> edges
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Filter:</span>
            {filters.map(f => (
              <button
                key={f.key}
                className={`${styles.filterBtn} ${filter === f.key ? styles.active : ''}`}
                style={{ '--filter-color': f.color } as any}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showExercises}
              onChange={(e) => setShowExercises(e.target.checked)}
            />
            <span>Show exercises for selected</span>
          </label>
        </Panel>

        <Panel position="top-right" className={styles.legend}>
          <h4>Legend</h4>
          {Object.entries(kindColors).map(([kind, colors]) => (
            <div key={kind} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: colors.border }} />
              <span>{kind}</span>
            </div>
          ))}
        </Panel>
      </ReactFlow>
    </div>
  )
}

export function AnatomyGraph(props: AnatomyGraphProps) {
  return (
    <ReactFlowProvider>
      <AnatomyGraphInner {...props} />
    </ReactFlowProvider>
  )
}

