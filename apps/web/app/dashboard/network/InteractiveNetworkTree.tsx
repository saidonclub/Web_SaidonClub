'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Star, Zap, Medal } from 'lucide-react';
import styles from './InteractiveTree.module.css';

interface Member {
  id: string;
  name: string | null;
  email: string;
  status: string;
  role: string;
  createdAt: string | Date;
  referrals?: Member[];
}

interface TreeProps {
  data: Member;
}

interface LayoutNode {
  data: Member;
  x: number;
  y: number;
  expanded: boolean;
  children: LayoutNode[];
}

// Tree calculation constants
const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;
const LEVEL_HEIGHT = 160;
const SIBLING_SPACING = 40;

const getRankIcon = (role: string) => {
  const r = role.toUpperCase();
  if (r.includes('DIAMANTE')) return <Star size={16} fill="currentColor" />;
  if (r.includes('RUBI')) return <Star size={16} />;
  if (r.includes('ESMERALDA') || r.includes('ZAFIRO')) return <ShieldCheck size={16} />;
  if (r.includes('ORO') || r.includes('PLATA')) return <Medal size={16} />;
  return <Zap size={16} />;
};

const LEVEL_COLORS = ['var(--clr-orange)', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6', '#f43f5e'];

export default function InteractiveNetworkTree({ data }: TreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 50, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id]));

  // Handle Zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newScale = Math.min(Math.max(transform.scale + delta, 0.2), 3);
      
      setTransform(prev => ({
        ...prev,
        scale: newScale
      }));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [transform.scale]);

  // Handle Pan
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const toggleNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Layout calculation
  const layout = useMemo(() => {
    let currentX = 0;

    const calculatePositions = (node: Member, depth: number): LayoutNode => {
      const isExpanded = expandedNodes.has(node.id);
      const childrenData = (isExpanded && node.referrals) ? node.referrals : [];
      
      const children = childrenData.map(c => calculatePositions(c, depth + 1));
      
      let x = 0;
      if (children.length === 0) {
        x = currentX;
        currentX += NODE_WIDTH + SIBLING_SPACING;
      } else {
        const firstChild = children[0];
        const lastChild = children[children.length - 1];
        x = (firstChild.x + lastChild.x) / 2;
      }

      return {
        data: node,
        x,
        y: depth * LEVEL_HEIGHT,
        expanded: isExpanded,
        children
      };
    };

    const rootLayout = calculatePositions(data, 0);

    // Center the root node horizontally by adjusting all X coordinates
    const offsetX = -rootLayout.x;
    
    const applyOffset = (node: LayoutNode) => {
      node.x += offsetX;
      node.children.forEach(applyOffset);
    };
    
    applyOffset(rootLayout);

    // Calculate bounds to set SVG size
    let minX = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const findBounds = (node: LayoutNode) => {
      if (node.x < minX) minX = node.x;
      if (node.x > maxX) maxX = node.x;
      if (node.y > maxY) maxY = node.y;
      node.children.forEach(findBounds);
    };
    
    findBounds(rootLayout);

    return { 
      root: rootLayout, 
      width: Math.max(maxX - minX + NODE_WIDTH + 100, 800), 
      height: maxY + NODE_HEIGHT + 100,
      minX: minX - 50,
      maxY
    };
  }, [data, expandedNodes]);

  const renderLinks = (node: LayoutNode): React.ReactNode[] => {
    const links: React.ReactNode[] = [];
    
    node.children.forEach(child => {
      const startX = node.x + NODE_WIDTH / 2;
      const startY = node.y + NODE_HEIGHT;
      const endX = child.x + NODE_WIDTH / 2;
      const endY = child.y;

      const midY = startY + (endY - startY) / 2;

      // Glow effect for links
      const isActive = child.data.status === 'ACTIVE';
      const color = isActive ? 'var(--clr-orange)' : 'rgba(255,255,255,0.1)';

      const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

      links.push(
        <motion.path
          key={`link-${node.data.id}-${child.data.id}`}
          d={path}
          fill="transparent"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      );

      links.push(...renderLinks(child));
    });

    return links;
  };

  const renderNodes = (node: LayoutNode, depth = 0): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    const hasChildren = node.data.referrals && node.data.referrals.length > 0;
    const isActive = node.data.status === 'ACTIVE';
    const color = LEVEL_COLORS[depth % LEVEL_COLORS.length];

    nodes.push(
      <foreignObject
        key={`node-${node.data.id}`}
        x={node.x}
        y={node.y}
        width={NODE_WIDTH}
        height={NODE_HEIGHT + 20}
        className={styles.foreignObject}
      >
        <motion.div 
          className={`${styles.nodeCard} ${isActive ? styles.activeNode : styles.inactiveNode}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ '--node-color': color } as React.CSSProperties}
        >
          <div className={styles.nodeHeader}>
            <div className={styles.nodeAvatar} style={{ color }}>
              {node.data.name ? node.data.name[0].toUpperCase() : <User size={16} />}
            </div>
            <div className={styles.nodeInfo}>
              <div className={styles.nodeName}>{node.data.name || 'Socio'}</div>
              <div className={styles.nodeRole}>
                {getRankIcon(node.data.role)}
                {node.data.role}
              </div>
            </div>
          </div>
          
          <div className={styles.nodeFooter}>
            <span className={styles.levelBadge}>Lvl {depth}</span>
            {hasChildren && (
              <button 
                className={styles.expandBtn} 
                onClick={(e) => toggleNode(e, node.data.id)}
                style={{ background: `${color}20`, color }}
              >
                {node.expanded ? 'Ocultar' : `Ver Red (${node.data.referrals?.length})`}
              </button>
            )}
          </div>
        </motion.div>
      </foreignObject>
    );

    node.children.forEach(child => {
      nodes.push(...renderNodes(child, depth + 1));
    });

    return nodes;
  };

  return (
    <div 
      className={styles.viewport} 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className={styles.controls}>
        <button onClick={() => setTransform(prev => ({ ...prev, scale: prev.scale * 1.2 }))}>+</button>
        <button onClick={() => setTransform(prev => ({ ...prev, scale: prev.scale / 1.2 }))}>-</button>
        <button onClick={() => setTransform({ x: 0, y: 50, scale: 1 })}>Reset</button>
      </div>

      <motion.svg
        className={styles.svgCanvas}
        style={{
          x: transform.x,
          y: transform.y,
          scale: transform.scale,
          transformOrigin: "center top"
        }}
        viewBox={`${layout.minX - 100} 0 ${layout.width + 200} ${layout.height + 200}`}
      >
        <g className={styles.linksLayer}>
          {renderLinks(layout.root)}
        </g>
        <g className={styles.nodesLayer}>
          {renderNodes(layout.root)}
        </g>
      </motion.svg>
    </div>
  );
}
