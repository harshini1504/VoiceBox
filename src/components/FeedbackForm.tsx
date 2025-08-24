"use client";

import { useEffect, useState } from "react";

export default function FeedbackForm({ onCreated }: { onCreated: () => void }) {
    const [form, setForm] = useState({ title:"", description:"", category:"FEATURE" as const });
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/auth/session")
            .then(r => r.json())
            .then(s => setUserId(s?.user?.id ?? null))
            .catch(() => setUserId(null));
    }, []);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!userId) { alert("Please sign in"); return; }
        const res = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({ ...form, authorId: userId }),
        });
        if (!res.ok) { alert("Failed to submit"); return; }
        setForm({ title:"", description:"", category:"FEATURE" });
        onCreated();
    }

    return (
        <div className="card" style={{marginBottom:16}}>
            <div className="h2">Submit feedback</div>
            <form onSubmit={submit} style={{display:"grid", gap:10}}>
                <input
                    className="input" placeholder="Title" value={form.title}
                    onChange={e=>setForm({...form, title:e.target.value})}
                />
                <textarea
                    className="textarea" placeholder="Description" value={form.description}
                    onChange={e=>setForm({...form, description:e.target.value})}
                />
                <select
                    className="select" value={form.category}
                    onChange={e=>setForm({...form, category: e.target.value as any})}
                    style={{maxWidth:160}}
                >
                    <option value="FEATURE">Feature</option>
                    <option value="BUG">Bug</option>
                    <option value="UX">UX</option>
                </select>
                <button className="btn" type="submit">Submit</button>
            </form>
        </div>
    );
}
