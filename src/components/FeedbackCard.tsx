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
                                         readOnly = false,
                                     }: {
    it: Item;
    onVote: (id: string) => void;
    readOnly?: boolean;
}) {
    return (
        <div className="card">
            <div className="row">
                <button
                    type="button"
                    aria-label={`Upvote ${it.title}`}
                    title={readOnly ? "Sign in on the main app to vote" : "Upvote / remove vote"}
                    onClick={() =>  onVote(it.id)}
                    className="vote-btn"
                    style={{ marginRight: 12 }}
                >
                    ⬆️ <span>{it.score}</span>
                </button>

                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{it.title}</div>
                    <div className="muted" style={{ fontSize: 14 }}>{it.description}</div>
                    <Badges category={it.category} status={it.status} tags={it.tags ?? []} />
                </div>
            </div>
        </div>
    );
}
