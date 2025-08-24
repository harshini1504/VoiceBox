"use client";

import { useEffect, useMemo, useState } from "react";
import FeedbackCard from "./FeedbackCard";

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
};

export default function FeedbackList() {
    const [items, setItems] = useState<Feedback[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [pending, setPending] = useState<Set<string>>(new Set());

    const refresh = async () => {
        const res = await fetch("/api/feedback", { cache: "no-store" });
        setItems(await res.json());
    };

    useEffect(() => {
        refresh();
        fetch("/api/auth/session").then(r => r.json()).then(s => setUserId(s?.user?.id ?? null)).catch(() => setUserId(null));
    }, []);

    const sorted = useMemo(
        () => [...items].sort((a, b) => b.score - a.score || a.status.localeCompare(b.status)),
        [items]
    );

    async function vote(id: string) {
        if (!userId) { alert("Sign in to vote"); return; }
        if (pending.has(id)) return;                       // guard double-clicks

        setPending(prev => new Set(prev).add(id));
        try {
            const res = await fetch(`/api/feedback/${id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) throw new Error(await res.text());
            const { score } = await res.json();             // <- use server value

            setItems(prev => prev.map(it => it.id === id ? { ...it, score } : it));
        } catch (e) {
            alert("Vote failed. Please try again.");
        } finally {
            setPending(prev => { const n = new Set(prev); n.delete(id); return n; });
        }
    }

    if (!items.length) return <div className="muted">No feedback yet.</div>;
    return <div className="list">{sorted.map(it => <FeedbackCard key={it.id} it={it} onVote={vote} />)}</div>;
}
