import React, { useState } from "react";

interface LineDataset {
  label: string;
  data: number[];
  color: string;
  unit?: string;
}

interface LineChartProps {
  title: string;
  subtitle?: string;
  labels: string[];
  datasets: LineDataset[];
}

export default function LineChart({
  title,
  subtitle,
  labels,
  datasets,
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    datasetIdx: number;
    pointIdx: number;
    value: number;
    label: string;
    datasetLabel: string;
    unit: string;
    x: number;
    y: number;
  } | null>(null);

  // SVG dimensions
  const width = 500;
  const height = 220;
  const paddingLeft = 50;
  const paddingRight = 50;
  const paddingTop = 30;
  const paddingBottom = 40;

  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;

  // Process coordinates for each dataset
  const processedDatasets = datasets.map((dataset, dIdx) => {
    const maxVal = Math.max(...dataset.data, 1);
    const minVal = 0; // Baseline at 0
    const points = dataset.data.map((val, pIdx) => {
      const divisor = labels.length > 1 ? labels.length - 1 : 1;
      const x = paddingLeft + (pIdx / divisor) * graphWidth;
      const y = height - paddingBottom - ((val - minVal) / (maxVal - minVal)) * graphHeight;
      return { x, y, value: val };
    });

    // Generate SVG path string
    let pathD = "";
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        // Curve calculation (simple bezier or straight lines)
        pathD += ` L ${points[i].x} ${points[i].y}`;
      }
    }

    return {
      ...dataset,
      points,
      pathD,
      maxVal,
    };
  });

  return (
    <div className="bg-white/80 border border-brand-sand/50 shadow-xs rounded-xl p-6 flex flex-col w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h4 className="text-sm font-bold text-brand-forest uppercase tracking-wider">{title}</h4>
          {subtitle && <p className="text-[11px] text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>
        
        {/* Legends */}
        <div className="flex flex-wrap gap-3 text-[10px] md:text-[11px] font-semibold text-zinc-500">
          {datasets.map((ds, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: ds.color, border: `1.5px solid ${ds.color}` }}></span>
              {ds.label}
            </span>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative flex-1 min-h-[180px] w-full">
        {/* Hover Tooltip Box */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-brand-forest text-brand-beige text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none transition-all duration-150 -translate-x-1/2 -translate-y-full mb-2 flex flex-col items-center"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            <span className="text-[8px] text-zinc-300 font-normal uppercase tracking-wider">{hoveredPoint.datasetLabel}</span>
            <span>
              {hoveredPoint.unit === "$" ? "$" : ""}
              {hoveredPoint.value.toLocaleString("es-AR")}
              {hoveredPoint.unit !== "$" ? ` ${hoveredPoint.unit}` : ""}
            </span>
            <span className="text-[8px] text-zinc-400 font-normal">{hoveredPoint.label}</span>
            <div className="w-1.5 h-1.5 bg-brand-forest rotate-45 -mb-1 mt-0.5"></div>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
          {/* Y Axis Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = height - paddingBottom - ratio * graphHeight;
            return (
              <line
                key={idx}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#E5E0D4"
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.5}
              />
            );
          })}

          {/* Render lines */}
          {processedDatasets.map((ds, dIdx) => (
            <g key={dIdx}>
              {/* Main Line path */}
              <path
                d={ds.pathD}
                fill="none"
                stroke={ds.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />

              {/* Data points (circles) */}
              {ds.points.map((pt, pIdx) => (
                <circle
                  key={pIdx}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.datasetIdx === dIdx && hoveredPoint?.pointIdx === pIdx ? 6 : 4}
                  fill="white"
                  stroke={ds.color}
                  strokeWidth={2.5}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => {
                    setHoveredPoint({
                      datasetIdx: dIdx,
                      pointIdx: pIdx,
                      value: pt.value,
                      label: labels[pIdx],
                      datasetLabel: ds.label,
                      unit: ds.unit || "",
                      x: pt.x,
                      y: pt.y,
                    });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          ))}

          {/* X Axis Labels */}
          {labels.map((label, idx) => {
            const divisor = labels.length > 1 ? labels.length - 1 : 1;
            const x = paddingLeft + (idx / divisor) * graphWidth;
            return (
              <text
                key={idx}
                x={x}
                y={height - paddingBottom + 18}
                textAnchor="middle"
                className="text-[10px] fill-zinc-400 font-semibold select-none"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
