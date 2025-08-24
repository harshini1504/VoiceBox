"use client";

export default function Badges({
                                   category, status, tags = [],
                               }: { category?: string; status?: string; tags?: string[] }) {
    const statusColor: Record<string,string> = {
        BACKLOG:"gray", NOW:"green", NEXT:"blue", LATER:"orange", DONE:"purple"
    };
    const catColor: Record<string,string> = {
        FEATURE:"blue", BUG:"orange", UX:"purple"
    };

    return (
        <div className="badges">
            {category && <span className={`badge ${catColor[category] ?? "gray"}`}>{category}</span>}
            {status && <span className={`badge ${statusColor[status] ?? "gray"}`}>{status}</span>}
            {tags.map(t => <span key={t} className="badge">{t}</span>)}
        </div>
    );
}
