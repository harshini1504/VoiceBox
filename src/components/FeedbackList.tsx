"use client";

import { useEffect, useMemo, useState } from "react";
import FeedbackCard from "@/components/FeedbackCard";

type Status = "BACKLOG" | "NOW" | "NEXT" | "LATER" | "DONE";
type Category = "FEATURE" | "BUG" | "UX";

type Feedback = {
    id: string;
    title: string;
    description: string;
    category: Category;
    status: Status;
    score: number;
    tags?: string[];
    createdAt?: string;
};

export default function FeedbackList() {
    const [items, setItems] = useState<Feedback[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [pending, setPending] = useState<Set<string>>(new Set());
    const [q, setQ] = useState(""); // <-- search text

    const refresh = async () => {
        const r = await fetch("/api/feedback", { cache: "no-store" });
        setItems(await r.json());
    };

    useEffect(() => {
        refresh();
        fetch("/api/auth/session")
            .then((r) => r.json())
            .then((s) => setUserId(s?.user?.id ?? null))
            .catch(() => setUserId(null));
    }, []);

    // filter by search, then sort by score
    const shown = useMemo(() => {
        const t = q.trim().toLowerCase();
        const filtered = t
            ? items.filter(
                (i) =>
                    i.title.toLowerCase().includes(t) ||
                    i.description.toLowerCase().includes(t)
            )
            : items;
        return [...filtered].sort(
            (a, b) => b.score - a.score || a.title.localeCompare(b.title)
        );
    }, [items, q]);

    async function vote(id: string) {
        if (!userId) { alert("Sign in to vote"); return; }
        if (pending.has(id)) return;

        setPending((p) => new Set(p).add(id));
        try {
            const res = await fetch(`/api/feedback/${id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })    // <-- your existing API expects this
            });

            if (!res.ok) {
                // try to show the server message if present
                let msg = "";
                try { msg = await res.text(); } catch {}
                throw new Error(msg || `Vote failed with ${res.status}`);
            }

            // don’t assume response shape; just reload items so score is correct
            await refresh();
        } catch (e: any) {
            alert(e?.message || "Vote failed. Please try again.");
        } finally {
            setPending((p) => { const n = new Set(p); n.delete(id); return n; });
        }
    }


    return (
        <>
            {/* search box */}
            <div className="card" style={{ marginBottom: 12 }}>
                <input
                    className="input"
                    placeholder="Search feedback…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            {/* list */}
            {shown.length === 0 ? (
                <div className="muted">No matching feedback.</div>
            ) : (
                <div className="list">
                    {shown.map((it) => (
                        <FeedbackCard key={it.id} it={it as any} onVote={vote} />
                    ))}
                </div>
            )}
        </>
    );
}
