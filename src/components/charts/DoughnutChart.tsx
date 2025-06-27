import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useAuth } from '@/hooks/useAuth';

interface DoughnutChartProps {
  data: number[];
  labels: string[];
  title?: string;
  backgroundColor?: string[];
}

const defaultColors = [
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(199, 199, 199, 0.8)',
  'rgba(123, 22, 86, 0.8)',
];

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  labels,
  title,
  backgroundColor: propBackgroundColor
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<'doughnut', number[], string> | null>(null);

  const chartBackgroundColor = propBackgroundColor && propBackgroundColor.length > 0 ? propBackgroundColor : defaultColors;

  useEffect(() => {
    if (chartRef.current) {
      const context = chartRef.current.getContext('2d');
      if (!context) {
        console.error("Failed to get 2D context from canvas");
        return;
      }

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const currentDatasetBackgroundColors: string[] = [];
      const currentDatasetBorderColors: string[] = [];

      for (let i = 0; i < data.length; i++) {
          const color = chartBackgroundColor[i % chartBackgroundColor.length];
          currentDatasetBackgroundColors.push(color);
          currentDatasetBorderColors.push(color.includes('rgba') ? color.replace(/,\s*\d?\.?\d+\s*\)/, ', 1)') : color);
      }

      chartInstanceRef.current = new Chart<'doughnut', number[], string>(context, { // Pass context directly
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: title || 'Data',
            data: data,
            backgroundColor: currentDatasetBackgroundColors,
            borderColor: currentDatasetBorderColors,
            borderWidth: 1,
            hoverOffset: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 20,
                padding: 15,
              }
            },
            title: {
              display: !!title,
              text: title,
              font: {
                size: 16,
              },
              padding: {
                  top: 10,
                  bottom: 20
              }
            },
            tooltip: {
              callbacks: {
                label: function(tooltipContext) {
                  let label = tooltipContext.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (tooltipContext.parsed !== null && tooltipContext.dataset && Array.isArray(tooltipContext.dataset.data)) {
                     const dataValues = tooltipContext.dataset.data as number[];
                     const total = dataValues.reduce((acc, val) => acc + (Number(val) || 0), 0);
                     const currentValue = Number(tooltipContext.parsed) || 0;
                     const percentage = total > 0 ? ((currentValue / total) * 100).toFixed(1) + '%' : '0%';
                     label += `${currentValue} (${percentage})`;
                  } else if (tooltipContext.parsed !== null) {
                      label += tooltipContext.parsed;
                  }
                  return label;
                }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, labels, title, chartBackgroundColor]);

  return (
    <div className="relative h-80 w-full md:h-96">
      <canvas ref={chartRef} width="400" height="400"></canvas> {/* Added default width/height */}
    </div>
  );
};

export default DoughnutChart;
