// src/app/issues/page.tsx
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    where,
    getDocs,
    orderBy,
    doc,
    updateDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function IssuesPage() {
    const [user, setUser] = useState<any>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [assignedTo, setAssignedTo] = useState("");
    const [warning, setWarning] = useState("");

    // Issues & filters
    const [issues, setIssues] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    // Track logged-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) setUser(u);
            else setUser(null);
        });
        return () => unsubscribe();
    }, []);

    // Fetch issues with filters
    const fetchIssues = async () => {
        let q = query(collection(db, "issues"), orderBy("createdAt", "desc"));

        if (statusFilter) {
            q = query(q, where("status", "==", statusFilter));
        }
        if (priorityFilter) {
            q = query(q, where("priority", "==", priorityFilter));
        }

        const querySnapshot = await getDocs(q);
        const issuesData: any[] = [];
        querySnapshot.forEach((doc) => {
            issuesData.push({ id: doc.id, ...doc.data() });
        });
        setIssues(issuesData);
    };

    useEffect(() => {
        fetchIssues();
    }, [statusFilter, priorityFilter]);

    // Create new issue
    const handleSubmit = async () => {
        if (!user) {
            alert("You must be logged in to create an issue.");
            return;
        }

        const tokens = [
            ...title.toLowerCase().split(/\s+/),
            ...description.toLowerCase().split(/\s+/)
        ];

        // Check for similar issues
        const q = query(
            collection(db, "issues"),
            where("searchTokens", "array-contains-any", tokens)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            setWarning("⚠️ Similar issues exist!");
            return;
        }

        await addDoc(collection(db, "issues"), {
            title,
            description,
            priority,
            status: "Open",
            assignedTo,
            createdBy: user.email,
            createdAt: serverTimestamp(),
            searchTokens: tokens
        });

        setTitle("");
        setDescription("");
        setPriority("Medium");
        setAssignedTo("");
        setWarning("");
        alert("Issue created successfully!");
        fetchIssues();
    };

    // Status update with rule enforcement
    const handleStatusChange = async (issueId: string, oldStatus: string, newStatus: string) => {
        if (oldStatus === "Open" && newStatus === "Done") {
            alert("Issue must move to In Progress first");
            return;
        }

        try {
            const issueRef = doc(db, "issues", issueId);
            await updateDoc(issueRef, { status: newStatus });
            fetchIssues();
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status");
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create Issue</h1>

            {warning && <div className="text-red-600 mb-2">{warning}</div>}

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 mb-2 w-full"
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 mb-2 w-full"
            />
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border p-2 mb-2 w-full"
            >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>
            <input
                type="text"
                placeholder="Assigned To (email)"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="border p-2 mb-2 w-full"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
            >
                Create Issue
            </button>

            <hr className="my-6" />

            <h2 className="text-xl font-bold mb-2">Filter Issues</h2>
            <div className="flex gap-2 mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2"
                >
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border p-2"
                >
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            <h2 className="text-xl font-bold mb-2">Issues List</h2>
            {issues.map((issue) => (
                <div key={issue.id} className="border p-4 mb-2 rounded">
                    <h3 className="font-semibold">{issue.title}</h3>
                    <p>{issue.description}</p>
                    <p>
                        <strong>Priority:</strong> {issue.priority} |{" "}
                        <strong>Status:</strong>{" "}
                        <select
                            value={issue.status}
                            onChange={(e) => handleStatusChange(issue.id, issue.status, e.target.value)}
                            className="border p-1"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </p>
                    <p>
                        <strong>Assigned To:</strong> {issue.assignedTo || "-"} |{" "}
                        <strong>Created By:</strong> {issue.createdBy || "-"}
                    </p>
                </div>
            ))}
        </div>
    );
}
