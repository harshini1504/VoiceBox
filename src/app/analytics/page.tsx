"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Chart,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    type ChartData,
    type ChartOptions,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);
Chart.defaults.color = "#cbd5e1";
Chart.defaults.borderColor = "rgba(148,163,184,.3)";

type Item = {
    status: "BACKLOG" | "NOW" | "NEXT" | "LATER" | "DONE";
    category: "FEATURE" | "BUG" | "UX";
};

export default function AnalyticsPage() {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        fetch("/api/feedback", { cache: "no-store" })
            .then((r) => r.json())
            .then(setItems);
    }, []);

    const statusLabels = ["BACKLOG", "NOW", "NEXT", "LATER", "DONE"] as const;
    const catLabels = ["FEATURE", "BUG", "UX"] as const;

    const countsByStatus = useMemo(
        () => statusLabels.map((s) => items.filter((i) => i.status === s).length),
        [items]
    );
    const countsByCategory = useMemo(
        () => catLabels.map((c) => items.filter((i) => i.category === c).length),
        [items]
    );

    // ---- TYPES MATTER HERE ----
    const barOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#e5e7eb" } } },
        scales: {
            x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148,163,184,.15)" } },
            y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148,163,184,.15)" }, beginAtZero: true },
        },
    };

    const barData: ChartData<"bar", number[], string> = {
        labels: [...statusLabels], // cast tuple -> string[]
        datasets: [
            {
                label: "Count",
                data: countsByStatus,
                backgroundColor: "rgba(59,130,246,0.6)",
                borderColor: "rgba(59,130,246,1)",
                borderWidth: 1.5,
                borderRadius: 8,
            },
        ],
    };

    const pieOptions: ChartOptions<"pie"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top", labels: { color: "#e5e7eb" } } },
    };

    const pieData: ChartData<"pie", number[], string> = {
        labels: [...catLabels],
        datasets: [
            {
                data: countsByCategory,
                backgroundColor: [
                    "rgba(99,102,241,0.7)",  // indigo
                    "rgba(239,68,68,0.7)",   // red
                    "rgba(16,185,129,0.7)",  // emerald
                ],
                borderColor: ["rgba(99,102,241,1)", "rgba(239,68,68,1)", "rgba(16,185,129,1)"],
                borderWidth: 1.5,
            },
        ],
    };

    return (
        <div className="container" style={{ paddingTop: 16 }}>
            <div className="card" style={{ height: 320, marginBottom: 16 }}>
                <div className="h2">Items by status</div>
                <div style={{ height: 260 }}>
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>

            <div className="card" style={{ height: 420 }}>
                <div className="h2">Items by category</div>
                <div style={{ height: 340 }}>
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>
        </div>
    );
}
