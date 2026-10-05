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
  deleted_at?: string | null;
  deleted_by?: string | null;
};

type InboxConversation = {
  id: string;
  postId: string | null;
  postTitle: string;
  otherName: string;
  latestMessage: string;
  latestMessageTime: string | null;
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
  const [inbox, setInbox] = useState<InboxConversation[]>([]);
  const [conversation, setConversation] =
    useState<ConversationInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [deletingMessageId, setDeletingMessageId] =
    useState<string | null>(null);

  async function getMyDeletedMessageIds(currentUserId: string) {
    const { data, error } = await supabase
      .from("message_deletions")
      .select("message_id")
      .eq("user_id", currentUserId);

    if (error) {
      console.error(error);
      return new Set<string>();
    }

    return new Set((data || []).map((item) => item.message_id));
  }

  async function loadInbox(currentUserId: string) {
    const { data: memberships, error: membershipError } =
      await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", currentUserId);

    if (membershipError) {
      setError(
        `Unable to load your messages: ${membershipError.message}`
      );
      return;
    }

    const conversationIds = Array.from(
      new Set(
        (memberships || []).map(
          (item) => item.conversation_id
        )
      )
    );

    if (!conversationIds.length) {
      setInbox([]);
      return;
    }

    const { data: conversations, error: conversationError } =
      await supabase
        .from("conversations")
        .select("id,post_id")
        .in("id", conversationIds);

    if (conversationError) {
      setError(
        `Unable to load conversations: ${conversationError.message}`
      );
      return;
    }

    const deletedIds =
      await getMyDeletedMessageIds(currentUserId);

    const results: InboxConversation[] = [];

    for (const row of conversations || []) {
      let postTitle = "NagaSphere conversation";

      if (row.post_id) {
        const { data: post } = await supabase
          .from("posts")
          .select("title")
          .eq("id", row.post_id)
          .maybeSingle();

        if (post?.title) {
          postTitle = post.title;
        }
      }

      const { data: members } = await supabase
        .from("conversation_members")
        .select("user_id")
        .eq("conversation_id", row.id);

      const otherId = (members || [])
        .map((member) => member.user_id)
        .find((id) => id !== currentUserId);

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

      const { data: messageRows } = await supabase
        .from("messages")
        .select(
          "id,conversation_id,sender_id,body,created_at,deleted_at,deleted_by"
        )
        .eq("conversation_id", row.id)
        .order("created_at", { ascending: false });

      const latest = (messageRows || []).find(
        (message) => !deletedIds.has(message.id)
      );

      results.push({
        id: row.id,
        postId: row.post_id,
        postTitle,
        otherName,
        latestMessage:
          latest?.body || "No messages yet",
        latestMessageTime:
          latest?.created_at || null,
      });
    }

    results.sort((a, b) => {
      if (!a.latestMessageTime) return 1;
      if (!b.latestMessageTime) return -1;

      return (
        new Date(b.latestMessageTime).getTime() -
        new Date(a.latestMessageTime).getTime()
      );
    });

    setInbox(results);
  }

  async function loadConversation(currentUserId: string) {
    if (!conversationId) {
      setConversation(null);
      setMessages([]);
      return;
    }

    const { data: members, error: memberError } =
      await supabase
        .from("conversation_members")
        .select("user_id")
        .eq("conversation_id", conversationId);

    if (memberError) {
      setError(
        `Unable to open this conversation: ${memberError.message}`
      );
      return;
    }

    const memberIds = (members || []).map(
      (member) => member.user_id
    );

    if (!memberIds.includes(currentUserId)) {
      setError(
        "You do not have access to this conversation."
      );
      return;
    }

    const otherId = memberIds.find(
      (id) => id !== currentUserId
    );

    const {
      data: conversationRow,
      error: conversationError,
    } = await supabase
      .from("conversations")
      .select("id,post_id")
      .eq("id", conversationId)
      .single();

    if (conversationError || !conversationRow) {
      setError("Conversation not found.");
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

    const {
      data: messageRows,
      error: messagesError,
    } = await supabase
      .from("messages")
      .select(
        "id,conversation_id,sender_id,body,created_at,deleted_at,deleted_by"
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      setError(
        `Unable to load messages: ${messagesError.message}`
      );
      return;
    }

    const deletedIds =
      await getMyDeletedMessageIds(currentUserId);

    setConversation({
      id: conversationId,
      postTitle,
      otherName,
    });

    setMessages(
      (messageRows || []).filter(
        (message) => !deletedIds.has(message.id)
      ) as Message[]
    );
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      if (!mounted) return;

      setUserId(user.id);

      await loadInbox(user.id);

      if (conversationId) {
        await loadConversation(user.id);
      }

      if (mounted) {
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [conversationId, router, supabase]);

  async function sendMessage() {
    const text = body.trim();

    if (!text || !conversationId || sending) {
      return;
    }

    setSending(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(
        "Your login session has expired. Please log in again."
      );
      setSending(false);
      return;
    }

    const { data: member } = await supabase
      .from("conversation_members")
      .select("user_id")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!member) {
      setError(
        "You are not a member of this conversation."
      );
      setSending(false);
      return;
    }

    const {
      data: newMessage,
      error: insertError,
    } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body: text,
      })
      .select(
        "id,conversation_id,sender_id,body,created_at,deleted_at,deleted_by"
      )
      .single();

    if (insertError) {
      setError(
        `Message could not be sent: ${insertError.message}`
      );
      setSending(false);
      return;
    }

    if (newMessage) {
      setMessages((current) => [
        ...current,
        newMessage as Message,
      ]);
    }

    setBody("");
    setSending(false);
    setUserId(user.id);

    await loadInbox(user.id);
  }

  async function deleteForMe(messageId: string) {
    if (!userId || deletingMessageId) {
      return;
    }

    if (
      !window.confirm(
        "Delete this message from your view?"
      )
    ) {
      return;
    }

    setDeletingMessageId(messageId);
    setError("");

    try {
      const { error } = await supabase
        .from("message_deletions")
        .insert({
          message_id: messageId,
          user_id: userId,
        });

      if (error && error.code !== "23505") {
        throw error;
      }

      setMessages((current) =>
        current.filter(
          (message) => message.id !== messageId
        )
      );

      await loadInbox(userId);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Message could not be deleted: ${err.message}`
          : "Message could not be deleted."
      );
    } finally {
      setDeletingMessageId(null);
    }
  }

  async function deleteForEveryone(messageId: string) {
    if (!userId || deletingMessageId) {
      return;
    }

    if (
      !window.confirm(
        "Delete this message for everyone? This is only available for 15 minutes after sending."
      )
    ) {
      return;
    }

    setDeletingMessageId(messageId);
    setError("");

    try {
      const { data, error } = await supabase.rpc(
        "delete_message_for_everyone",
        {
          p_message_id: messageId,
        }
      );

      if (error) {
        throw error;
      }

      if (!data) {
        setError(
          "This message can no longer be deleted for everyone."
        );
        return;
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                body: "[Message deleted]",
                deleted_at: new Date().toISOString(),
                deleted_by: userId,
              }
            : message
        )
      );

      await loadInbox(userId);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Message could not be deleted for everyone: ${err.message}`
          : "Message could not be deleted for everyone."
      );
    } finally {
      setDeletingMessageId(null);
    }
  }

  const pageStyle = {
    backgroundImage: "url('/messages-scenic-bg.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center top",
    backgroundSize: "100% auto",
    backgroundAttachment: "scroll",
  };

  if (loading) {
    return (
      <main
        className="min-h-screen bg-[#082623]"
        style={pageStyle}
      >
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-white/80">
            Loading messages...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#082623]"
      style={pageStyle}
    >
      <div className="min-h-screen w-full px-5 py-7 sm:px-9 sm:py-9 lg:px-[47px] lg:py-[46px]">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="shrink-0"
          >
            <img
  src="/nagasphere-logo.png"
  alt="NagaSphere"
  className="block h-auto w-[100px] object-contain sm:w-[100px] md:w-[270px]"
/>
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-xl border border-[#80c996]/70 bg-[#082623]/55 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-[#082623]/80"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
              />
            </svg>
            Dashboard
          </button>
        </header>

        <section className="mt-10 sm:mt-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#a8e69b] text-[#a8e69b]">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2v-4.2A7.5 7.5 0 1 1 20 11.5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="text-[40px] font-bold leading-none tracking-tight text-white sm:text-[44px]">
              Messages
            </h1>
          </div>

          <p className="ml-14 mt-3 text-base text-white/80">
            Your conversations with NagaSphere buyers and sellers.
          </p>

          {error && (
            <div className="mb-5 mt-6 w-[746px] max-w-full rounded-xl border border-red-200/30 bg-red-950/50 p-4 text-sm text-red-100">
              {error}
            </div>
          )}

          {!conversationId ? (
            inbox.length === 0 ? (
              <div className="mt-7 min-h-[915px] w-[746px] max-w-full rounded-2xl border border-[#dfe8e5] bg-[#f8fbfa] p-10 shadow-2xl">
                <div className="flex min-h-[815px] items-center justify-center text-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      No conversations yet
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                      When someone contacts you about a listing,
                      the conversation will appear here.
                    </p>

                    <button
                      type="button"
                      onClick={() => router.push("/listing")}
                      className="mt-5 rounded-xl bg-[#082623] px-5 py-3 text-sm font-semibold text-white"
                    >
                      Browse NagaSphere
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-7 min-h-[915px] w-[746px] max-w-full overflow-hidden rounded-2xl border border-[#dfe8e5] bg-[#f8fbfa] shadow-2xl">
                {inbox.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/messages?conversation=${item.id}`
                      )
                    }
                    className={`block w-full px-8 py-6 text-left transition hover:bg-white ${
                      index > 0
                        ? "border-t border-[#dce6e2]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b3b31] text-[#c7ef91]">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-6 w-6"
                          fill="currentColor"
                        >
                          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
                        </svg>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h2 className="truncate text-base font-bold text-gray-900">
                              {item.otherName}
                            </h2>

                            <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                              {item.postTitle}
                            </p>
                          </div>

                          {item.latestMessageTime && (
                            <span className="shrink-0 text-xs text-gray-400">
                              {new Date(
                                item.latestMessageTime
                              ).toLocaleDateString("en-GB")}
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-1 truncate text-sm ${
                            item.latestMessage ===
                            "[Message deleted]"
                              ? "italic text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {item.latestMessage}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}

                <div className="min-h-[630px] bg-[#f8fbfa]" />
              </div>
            )
          ) : (
            <>
              <button
                type="button"
                onClick={() => router.push("/messages")}
                className="mt-5 text-sm font-medium text-white/75 hover:text-white"
              >
                ← All Messages
              </button>

              <div className="mt-4 w-[746px] max-w-full overflow-hidden rounded-2xl border border-[#dfe8e5] bg-[#f8fbfa] shadow-2xl">
                <div className="border-b border-[#dce6e2] px-7 py-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Conversation
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    {conversation?.otherName ||
                      "NagaSphere user"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {conversation?.postTitle || "Listing"}
                  </p>
                </div>

                <div className="min-h-[500px] p-6">
                  {messages.length === 0 ? (
                    <div className="flex min-h-[440px] items-center justify-center text-center text-sm text-gray-500">
                      No messages yet. Start the conversation below.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const mine =
                          message.sender_id === userId;

                        const deleted =
                          Boolean(message.deleted_at);

                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              mine
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div className="max-w-[78%]">
                              <div
                                className={`rounded-2xl px-4 py-3 text-sm ${
                                  deleted
                                    ? "bg-gray-100 text-gray-400 italic"
                                    : mine
                                      ? "bg-[#082623] text-white"
                                      : "border border-gray-200 bg-white text-gray-900"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {message.body}
                                </p>

                                <p
                                  className={`mt-1 text-[10px] ${
                                    mine && !deleted
                                      ? "text-white/60"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {new Date(
                                    message.created_at
                                  ).toLocaleString()}
                                </p>
                              </div>

                              {!deleted && (
                                <div
                                  className={`mt-1 flex gap-3 ${
                                    mine
                                      ? "justify-end"
                                      : "justify-start"
                                  }`}
                                >
                                  <button
                                    type="button"
                                    disabled={
                                      deletingMessageId ===
                                      message.id
                                    }
                                    onClick={() =>
                                      deleteForMe(message.id)
                                    }
                                    className="text-[10px] text-white/70 underline"
                                  >
                                    Delete for me
                                  </button>

                                  {mine && (
                                    <button
                                      type="button"
                                      disabled={
                                        deletingMessageId ===
                                        message.id
                                      }
                                      onClick={() =>
                                        deleteForEveryone(
                                          message.id
                                        )
                                      }
                                      className="text-[10px] text-white/70 underline"
                                    >
                                      Delete for everyone
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 w-[746px] max-w-full">
                <div className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/95 p-2 shadow-2xl">
                  <input
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey
                      ) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    maxLength={5000}
                    disabled={sending}
                    placeholder="Write a message..."
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#082623]"
                  />

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={
                      sending || !body.trim()
                    }
                    className="shrink-0 rounded-xl bg-[#082623] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#082623]">
          <p className="text-white/80">
            Loading messages...
          </p>
        </main>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
