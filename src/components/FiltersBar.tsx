"use client";

import { useState } from "react";

export type Filters = {
    q?: string;
    category?: "" | "FEATURE" | "BUG" | "UX";
    status?: "" | "BACKLOG" | "NOW" | "NEXT" | "LATER" | "DONE";
    sort?: "score" | "new";
};

export default function FiltersBar({
                                       onChangeAction,                         // <-- renamed
                                   }: {
    onChangeAction: (f: Filters) => void;   // <-- renamed
}) {
    const [f, setF] = useState<Filters>({ q: "", category: "", status: "", sort: "score" });

    function update(patch: Partial<Filters>) {
        const next = { ...f, ...patch };
        setF(next);
        onChangeAction(next);                 // <-- renamed
    }

    return (
        <div className="card" style={{ display: "grid", gap: 10, marginBottom: 12 }}>
            <input
                className="input"
                placeholder="Search feedback…"
                value={f.q}
                onChange={(e) => update({ q: e.target.value })}
            />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <select className="select" value={f.category} onChange={(e) => update({ category: e.target.value as any })} style={{ maxWidth: 180 }}>
                    <option value="">All categories</option>
                    <option value="FEATURE">Feature</option>
                    <option value="BUG">Bug</option>
                    <option value="UX">UX</option>
                </select>
                <select className="select" value={f.status} onChange={(e) => update({ status: e.target.value as any })} style={{ maxWidth: 180 }}>
                    <option value="">All status</option>
                    <option>BACKLOG</option><option>NOW</option><option>NEXT</option><option>LATER</option><option>DONE</option>
                </select>
                <select className="select" value={f.sort} onChange={(e) => update({ sort: e.target.value as any })} style={{ maxWidth: 180 }}>
                    <option value="score">Sort: Most upvoted</option>
                    <option value="new">Sort: Newest</option>
                </select>
            </div>
        </div>
    );
}
