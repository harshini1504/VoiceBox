"use client";

type Props = {
    category: "FEATURE" | "BUG" | "UX";
    status: "BACKLOG" | "NOW" | "NEXT" | "LATER" | "DONE";
    tags?: string[];
};

export default function Badges({ category, status, tags = [] }: Props) {
    return (
        <div className="badges" style={{ marginTop: 8, gap: 8, display: "flex", flexWrap: "wrap" }}>
            <span className="badge" data-variant="category">{category}</span>
            <span className="badge" data-variant="status">{status}</span>
            {tags.map((t) => (
                <span key={t} className="badge">{t}</span>
            ))}
        </div>
    );
}
