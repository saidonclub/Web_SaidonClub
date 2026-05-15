'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, User, Users, ShieldCheck, Star, Zap, Medal, Search, List, GitBranch } from 'lucide-react';
import styles from './Network.module.css';

interface Member {
  id: string;
  name: string | null;
  email: string;
  status: string;
  role: string;
  createdAt: string | Date;
  referrals?: Member[];
}

interface NetworkTreeProps {
  directs: Member[];
}

// ─── Vista Lista (original mejorada) ───────────────────────────────────────

const TreeNode = ({ member, level = 1, forceExpand = false }: { member: Member; level?: number; forceExpand?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = member.referrals && member.referrals.length > 0;
  const expanded = forceExpand || isExpanded;

  const toggleExpand = (e: React.MouseEvent) => {
    if (hasChildren && !forceExpand) {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    }
  };

  const getRankIcon = (role: string) => {
    const r = role.toUpperCase();
    if (r.includes('DIAMANTE')) return <Star size={12} fill="currentColor" />;
    if (r.includes('RUBI')) return <Star size={12} />;
    if (r.includes('ESMERALDA') || r.includes('ZAFIRO')) return <ShieldCheck size={12} />;
    if (r.includes('ORO') || r.includes('PLATA')) return <Medal size={12} />;
    return <Zap size={12} />;
  };

  return (
    <div className={`${styles.treeNodeWrapper} ${level > 1 ? styles.nestedNode : ''}`}>
      <div
        className={`${styles.nodeHeader} ${expanded ? styles.nodeActive : ''} ${!hasChildren ? styles.noChildren : ''}`}
        onClick={toggleExpand}
      >
        <div className={styles.nodeToggle}>
          {hasChildren ? (
            expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
          ) : (
            <div className={styles.dotSeparator} />
          )}
        </div>

        <div className={styles.nodeMain}>
          <div className={styles.levelIndicator}>
            <span className={styles.levelLabel}>L{level}</span>
          </div>
          <div className={`${styles.nodeAvatar} ${styles[`level${level}`] || styles.levelDeep}`}>
            {member.name ? member.name[0].toUpperCase() : <User size={level === 1 ? 16 : 12} />}
          </div>
          <div className={styles.nodeInfo}>
            <div className={styles.nameRow}>
              <span className={styles.nodeName}>{member.name || 'Socio'}</span>
              <span className={styles.roleIcon}>{getRankIcon(member.role)}</span>
            </div>
            <span className={styles.nodeEmail}>{member.email}</span>
          </div>
        </div>

        <div className={styles.nodeBadges}>
          <div className={`${styles.statusBadge} ${member.status === 'ACTIVE' ? styles.active : styles.inactive}`}>
            <span className={styles.statusDot}></span>
            {member.status === 'ACTIVE' ? (level === 1 ? 'Activo' : 'A') : (level === 1 ? 'Inactivo' : 'I')}
          </div>
          <span className={styles.rankBadge}>{member.role}</span>
        </div>

        {hasChildren && (
          <div className={styles.nodeStats}>
            <span className={styles.nodeStatLabel}>Red:</span>
            <span className={styles.nodeStatValue}>{member.referrals?.length}</span>
          </div>
        )}
      </div>

      {expanded && hasChildren && (
        <div className={styles.nodeChildrenContainer}>
          {member.referrals!.map((child) => (
            <TreeNode key={child.id} member={child} level={level + 1} forceExpand={forceExpand} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Vista Gráfica (árbol visual) ──────────────────────────────────────────

const GraphNode = ({ member, depth = 0 }: { member: Member; depth?: number }) => {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = member.referrals && member.referrals.length > 0;
  const isActive = member.status === 'ACTIVE';

  const LEVEL_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b'];
  const color = LEVEL_COLORS[depth % LEVEL_COLORS.length];

  return (
    <div className={styles.graphNodeWrap}>
      <div
        className={styles.graphNode}
        style={{ borderColor: color, boxShadow: `0 0 0 1px ${color}20` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className={styles.graphAvatar} style={{ background: `${color}20`, color }}>
          {member.name ? member.name[0].toUpperCase() : '?'}
        </div>
        <div className={styles.graphInfo}>
          <div className={styles.graphName}>{member.name || 'Socio'}</div>
          <div className={styles.graphRole} style={{ color }}>{member.role}</div>
        </div>
        <div
          className={styles.graphStatus}
          style={{ background: isActive ? '#22c55e20' : '#ef444420', color: isActive ? '#22c55e' : '#ef4444' }}
        >
          {isActive ? '●' : '○'}
        </div>
        {hasChildren && (
          <div className={styles.graphToggle} style={{ color }}>
            {expanded ? '▲' : '▼'} {member.referrals!.length}
          </div>
        )}
      </div>

      {expanded && hasChildren && (
        <div className={styles.graphChildren}>
          <div className={styles.graphConnector} style={{ borderColor: `${color}40` }} />
          <div className={styles.graphChildRow}>
            {member.referrals!.map((child) => (
              <GraphNode key={child.id} member={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Componente Principal ───────────────────────────────────────────────────

export default function NetworkTree({ directs }: NetworkTreeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

  const filteredDirects = useMemo(() => {
    if (!searchTerm.trim()) return directs;
    const term = searchTerm.toLowerCase();

    function filterNodes(nodes: Member[]): Member[] {
      return nodes.reduce((acc: Member[], node) => {
        const matches =
          (node.name?.toLowerCase().includes(term)) ||
          (node.email.toLowerCase().includes(term)) ||
          (node.role.toLowerCase().includes(term));
        const filteredChildren = node.referrals ? filterNodes(node.referrals) : [];
        if (matches || filteredChildren.length > 0) {
          acc.push({ ...node, referrals: filteredChildren });
        }
        return acc;
      }, []);
    }
    return filterNodes(directs);
  }, [directs, searchTerm]);

  return (
    <div className={styles.treeWrapper}>
      {/* Controls */}
      <div className={styles.treeControls}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar socio por nombre, email o rango..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
            onClick={() => setViewMode('list')}
            title="Vista Lista"
          >
            <List size={16} />
            Lista
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === 'graph' ? styles.viewBtnActive : ''}`}
            onClick={() => setViewMode('graph')}
            title="Vista Árbol"
          >
            <GitBranch size={16} />
            Árbol
          </button>
        </div>
      </div>

      {filteredDirects.length === 0 ? (
        <div className={styles.emptyTree}>
          {searchTerm ? (
            <>
              <Search size={48} className={styles.emptyIcon} />
              <h3>No se encontraron resultados</h3>
              <p>{`Ningún socio coincide con "${searchTerm}".`}</p>
            </>
          ) : (
            <>
              <Users size={48} className={styles.emptyIcon} />
              <h3>Sin socios directos</h3>
              <p>Tu red comenzará a aparecer aquí cuando invites a nuevos miembros.</p>
            </>
          )}
        </div>
      ) : viewMode === 'list' ? (
        <div className={styles.treeRoot}>
          {filteredDirects.map((member) => (
            <TreeNode key={member.id} member={member} forceExpand={searchTerm.trim().length > 0} />
          ))}
        </div>
      ) : (
        <div className={styles.graphRoot}>
          <div className={styles.graphRootLabel}>
            <div className={styles.graphRootNode}>
              <span>👑</span>
              <span>Tú</span>
            </div>
            <div className={styles.graphRootLine} />
          </div>
          <div className={styles.graphChildRow}>
            {filteredDirects.map((member) => (
              <GraphNode key={member.id} member={member} depth={0} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
