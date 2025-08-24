"use client";

import Badges from "./Badges";

type Item = {
    id: string;
    title: string;
    description: string;
    category: "FEATURE" | "BUG" | "UX";
    status: "BACKLOG" | "NOW" | "NEXT" | "LATER" | "DONE";
    score: number;
    tags?: string[];
};

export default function FeedbackCard({
                                         it,
                                         onVote,
                                     }: {
    it: Item;
    onVote: (id: string) => void;
}) {
    return (
        <div className="card">
            <div className="row">
                {/* Upvote button */}
                <button
                    type="button"
                    aria-label={`Upvote ${it.title}`}
                    title="Upvote"
                    onClick={() => onVote(it.id)}
                    className="vote-btn"
                    style={{ marginRight: 12 }}
                >
                    ⬆️ <span>{it.score}</span>
                </button>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em" }}>
                        {it.title}
                    </div>
                    <div className="muted" style={{ fontSize: 16, marginTop: 4 }}>
                        {it.description}
                    </div>

                    {/* Category / Status / Tags */}
                    <Badges category={it.category} status={it.status} tags={it.tags ?? []} />
                </div>
            </div>
        </div>
    );
}
