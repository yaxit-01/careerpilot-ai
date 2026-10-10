import { useEffect, useMemo } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const COLORS = {
  background: "#101A2B",
  border: "#263449",
  text: "#F8FAFC",
  muted: "#94A3B8",
  accent: "#63E6BE",
  completed: "#16A34A",
  progress: "#38BDF8",
};

function getStatusColor(status) {
  switch (String(status || "").toLowerCase()) {
    case "completed":
      return COLORS.completed;

    case "in-progress":
    case "in progress":
      return COLORS.progress;

    default:
      return COLORS.accent;
  }
}

function MilestoneNode({ data }) {
  const statusColor = getStatusColor(data.status);

  return (
    <div
      style={{
        width: 220,
        minHeight: 100,
        padding: "14px",
        borderRadius: 14,
        border: `1px solid ${statusColor}`,
        borderTop: `3px solid ${statusColor}`,
        background: COLORS.background,
        color: COLORS.text,
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: COLORS.accent,
          border: "2px solid #0B1220",
          width: 9,
          height: 9,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <span
          style={{
            display: "flex",
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            width: 25,
            height: 25,
            borderRadius: 8,
            background: `${statusColor}20`,
            color: statusColor,
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {data.index + 1}
        </span>

        <strong
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            overflowWrap: "anywhere",
          }}
        >
          {data.title}
        </strong>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          color: COLORS.muted,
        }}
      >
        <span>{data.durationWeeks} weeks</span>

        <span
          style={{
            color: statusColor,
            fontWeight: 700,
            textTransform: "capitalize",
          }}
        >
          {data.status || "Not Started"}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: COLORS.accent,
          border: "2px solid #0B1220",
          width: 9,
          height: 9,
        }}
      />
    </div>
  );
}

const nodeTypes = {
  milestone: MilestoneNode,
};

function buildGraph(milestones) {
  const validIds = new Set(milestones.map((item) => item.id));

  const nodes = milestones.map((milestone, index) => {
    const columnCount = 2;
    const column = index % columnCount;
    const row = Math.floor(index / columnCount);

    // Alternate the horizontal direction on each row.
    const actualColumn = row % 2 === 0
      ? column
      : columnCount - 1 - column;

    return {
      id: milestone.id,

      type: "milestone",

      position: {
        x: actualColumn * 340,
        y: row * 190,
      },

      data: {
        title: milestone.title,
        durationWeeks: milestone.durationWeeks || 1,
        status: milestone.status || "not-started",
        index,
      },

      style: {
        width: 220,
        background: "transparent",
        border: "none",
        padding: 0,
      },
    };
  });

  const edges = milestones.flatMap((milestone) =>
    (milestone.prerequisites || [])
      .filter((prerequisite) => validIds.has(prerequisite))
      .map((prerequisite) => ({
        id: `${prerequisite}-${milestone.id}`,
        source: prerequisite,
        target: milestone.id,

        type: "smoothstep",

        animated: false,

        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: COLORS.accent,
        },

        style: {
          stroke: COLORS.accent,
          strokeWidth: 2,
        },
      }))
  );

  return { nodes, edges };
}

export default function RoadmapGraph({
  milestones = [],
  onSelect,
}) {
  const graph = useMemo(
    () => buildGraph(milestones),
    [milestones]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    graph.nodes
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    graph.edges
  );

  useEffect(() => {
    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [graph, setNodes, setEdges]);

  if (!milestones.length) {
    return (
      <div className="roadmap-empty">
        <h3>Your roadmap will appear here</h3>
        <p>
          Generate a career roadmap to explore your learning milestones.
        </p>
      </div>
    );
  }

  return (
    <div className="roadmap-graph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => {
          const selected = milestones.find(
            (item) => item.id === node.id
          );

          if (selected) {
            onSelect?.(selected);
          }
        }}
        fitView
        fitViewOptions={{
          padding: 0.15,
          maxZoom: 0.9,
          minZoom: 0.4,
        }}
        minZoom={0.3}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background
          color="#263449"
          gap={24}
          size={1}
        />

        <Controls
          showInteractive={false}
        />

        <MiniMap
          nodeColor={(node) =>
            getStatusColor(node.data?.status)
          }
          maskColor="rgba(8, 13, 25, 0.75)"
          style={{
            background: "#0B1220",
            border: "1px solid #263449",
            borderRadius: 10,
          }}
        />
      </ReactFlow>
    </div>
  );
}