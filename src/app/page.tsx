"use client";

import FeedbackForm from "@/components/FeedbackForm";
import FeedbackList from "@/components/FeedbackList";

export default function Home() {
    return (
        <>
            <h1 className="h1">Submit feedback</h1>
            <FeedbackForm onCreated={() => { /* list reload handled in list */ }} />
            <h2 className="h1">Feedback board</h2>
            <FeedbackList />

        </>
    );
}
