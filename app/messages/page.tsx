"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type ConversationInfo = {
  id: string;
  postTitle: string;
  otherName: string;
};

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation");
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [conversation, setConversation] =
    useState<ConversationInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/auth");
        return;
      }

      if (!mounted) return;

      setUserId(session.user.id);

      if (!conversationId) {
        setError("No conversation was selected.");
        setLoading(false);
        return;
      }

      const { data: membership, error: memberError } = await supabase
        .from("conversation_members")
        .select("user_id")
        .eq("conversation_id", conversationId);

      if (memberError) {
        setError("Unable to open this conversation.");
        setLoading(false);
        return;
      }

      const memberIds = (membership || []).map((m) => m.user_id);

      if (!memberIds.includes(session.user.id)) {
        setError("You do not have access to this conversation.");
        setLoading(false);
        return;
      }

      const otherId = memberIds.find((id) => id !== session.user.id);

      const { data: conversationRow, error: conversationError } =
        await supabase
          .from("conversations")
          .select("id,post_id")
          .eq("id", conversationId)
          .single();

      if (conversationError || !conversationRow) {
        setError("Conversation not found.");
        setLoading(false);
        return;
      }

      let postTitle = "NagaSphere conversation";

      if (conversationRow.post_id) {
        const { data: post } = await supabase
          .from("posts")
          .select("title")
          .eq("id", conversationRow.post_id)
          .maybeSingle();

        if (post?.title) {
          postTitle = post.title;
        }
      }

      let otherName = "NagaSphere user";

      if (otherId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", otherId)
          .maybeSingle();

        if (profile?.full_name) {
          otherName = profile.full_name;
        }
      }

      const { data: messageRows, error: messagesError } = await supabase
        .from("messages")
        .select("id,conversation_id,sender_id,body,created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        setError("Unable to load messages.");
        setLoading(false);
        return;
      }

      if (!mounted) return;

      setConversation({
        id: conversationId,
        postTitle,
        otherName,
      });

      setMessages(messageRows || []);
      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [conversationId, router, supabase]);

  async function sendMessage() {
    const text = body.trim();

    if (!text || !conversationId || !userId || sending) {
      return;
    }

    setSending(true);
    setError("");

    const { data, error: insertError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        body: text,
      })
      .select("id,conversation_id,sender_id,body,created_at")
      .single();

    if (insertError) {
      setError("Unable to send your message right now.");
      setSending(false);
      return;
    }

    setMessages((current) => [
      ...current,
      data as Message,
    ]);

    setBody("");
    setSending(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-600">
            Opening conversation...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        <div className="mb-4 rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Conversation
          </p>

          <h1 className="mt-1 text-xl font-bold text-gray-900">
            {conversation?.otherName || "NagaSphere user"}
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            About: {conversation?.postTitle || "Listing"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="min-h-[420px] rounded-2xl border bg-gray-50 p-4">

          {messages.length === 0 ? (
            <div className="flex min-h-[380px] items-center justify-center text-center text-sm text-gray-500">
              No messages yet. Start the conversation below.
            </div>
          ) : (
            <div className="space-y-3">

              {messages.map((message) => {
                const mine = message.sender_id === userId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      mine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        mine
                          ? "bg-black text-white"
                          : "border bg-white text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.body}
                      </p>

                      <p
                        className={`mt-1 text-[11px] ${
                          mine
                            ? "text-gray-300"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(
                          message.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </div>

        <div className="mt-4 flex gap-2">

          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            maxLength={5000}
            placeholder="Write a message..."
            className="min-w-0 flex-1 rounded-xl border px-4 py-3 text-sm outline-none focus:border-black"
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={sending || !body.trim()}
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>

        </div>

      </div>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white p-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-gray-600">
              Opening conversation...
            </p>
          </div>
        </main>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
