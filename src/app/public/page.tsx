"use client";

import { useEffect, useMemo, useState } from "react";
import FeedbackCard from "@/components/FeedbackCard";
import FiltersBar, { type Filters } from "@/components/FiltersBar";
import FeedbackForm from "@/components/FeedbackForm";

type Feedback = {
    id: string;
    title: string;
    description: string;
    category: "FEATURE" | "BUG" | "UX";
    status: "BACKLOG" | "NOW" | "NEXT" | "LATER" | "DONE";
    score: number;
    tags?: string[];
    createdAt?: string;
};

export default function PublicBoard() {
    const [items, setItems] = useState<Feedback[]>([]);
    const [filters, setFilters] = useState<Filters>({ q: "", category: "", status: "", sort: "score" });
    const [userId, setUserId] = useState<string | null>(null);

    const refresh = async () => {
        const r = await fetch("/api/feedback", { cache: "no-store" });
        setItems(await r.json());
    };

    useEffect(() => {
        refresh();
        fetch("/api/auth/session")
            .then(r => r.json())
            .then(s => setUserId(s?.user?.id ?? null))
            .catch(() => setUserId(null));
    }, []);

    const shown = useMemo(() => {
        let arr = [...items];
        const { q, category, status, sort } = filters;

        if (q) {
            const t = q.toLowerCase();
            arr = arr.filter(i => i.title.toLowerCase().includes(t) || i.description.toLowerCase().includes(t));
        }
        if (category) arr = arr.filter(i => i.category === category);
        if (status) arr = arr.filter(i => i.status === status);

        if (sort === "score") {
            arr.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
        } else {
            arr.sort((a, b) => {
                const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
                const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
                return tb - ta;
            });
        }
        return arr;
    }, [items, filters]);

    const totals = useMemo(() => {
        const byStatus: Record<string, number> = { BACKLOG: 0, NOW: 0, NEXT: 0, LATER: 0, DONE: 0 };
        const byCategory: Record<string, number> = { FEATURE: 0, BUG: 0, UX: 0 };
        for (const i of items) { byStatus[i.status]++; byCategory[i.category]++; }
        const top3 = [...items].sort((a, b) => b.score - a.score).slice(0, 3);
        return { total: items.length, byStatus, byCategory, top3 };
    }, [items]);

    return (
        <div className="container" style={{ paddingTop: 16 }}>
            {/* About */}
            <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 20 }}>🎤 VoiceBox — Public Feedback Board</div>
                <p className="muted" style={{ marginTop: 6 }}>
                    VoiceBox lets anyone browse ideas and see trends. Sign in to submit suggestions or upvote existing ones.
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <a className="btn" href="/">Sign in &amp; contribute</a>
                    <a className="btn btn-outline" href="/analytics">View analytics</a>
                </div>
            </div>

            {/* Snapshot */}
            <div className="card" style={{ marginBottom: 12 }}>
                <div className="h2">Snapshot</div>
                <div className="muted" style={{ marginBottom: 8 }}>Total items: <b>{totals.total}</b></div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <div>
                        <div className="muted" style={{ marginBottom: 4 }}>By status</div>
                        <div className="badges">
                            {Object.entries(totals.byStatus).map(([k, v]) => <span key={k} className="badge">{k}: {v}</span>)}
                        </div>
                    </div>
                    <div>
                        <div className="muted" style={{ marginBottom: 4 }}>By category</div>
                        <div className="badges">
                            {Object.entries(totals.byCategory).map(([k, v]) => <span key={k} className="badge">{k}: {v}</span>)}
                        </div>
                    </div>
                    <div>
                        <div className="muted" style={{ marginBottom: 4 }}>Top 3 most upvoted</div>
                        {totals.top3.length ? (
                            <ol style={{ margin: 0, paddingLeft: 18 }}>
                                {totals.top3.map(t => <li key={t.id}>{t.title} <span className="muted">({t.score})</span></li>)}
                            </ol>
                        ) : <span className="muted">No items yet</span>}
                    </div>
                </div>
            </div>

            {/* If logged in, you *may* show the form here too; otherwise it's read-only */}
            {userId && <FeedbackForm onCreated={refresh} />}

            {/* Filters */}
            <FiltersBar onChangeAction={setFilters} />

            {/* Read-only list (vote disabled on public) */}
            <div className="list">
                {shown.map(it => (
                    <FeedbackCard key={it.id} it={it as any} onVote={() => {}} readOnly />
                ))}
            </div>
        </div>
    );
}
