"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
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

  const conversationId =
    searchParams.get("conversation");

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [userId, setUserId] =
    useState<string | null>(null);

  const [inbox, setInbox] =
    useState<InboxConversation[]>([]);

  const [conversation, setConversation] =
    useState<ConversationInfo | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [body, setBody] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] = useState("");

  const [deletingMessageId, setDeletingMessageId] =
    useState<string | null>(null);

  async function getMyDeletedMessageIds(
    currentUserId: string
  ) {
    const {
      data,
      error,
    } = await supabase
      .from("message_deletions")
      .select("message_id")
      .eq("user_id", currentUserId);

    if (error) {
      console.error(
        "Message deletion records error:",
        error
      );

      return new Set<string>();
    }

    return new Set(
      (data || []).map(
        (item) => item.message_id
      )
    );
  }

  async function loadInbox(
    currentUserId: string
  ) {
    const {
      data: memberships,
      error: membershipError,
    } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", currentUserId);

    if (membershipError) {
      console.error(
        "Inbox membership error:",
        membershipError
      );

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

    if (conversationIds.length === 0) {
      setInbox([]);
      return;
    }

    const {
      data: conversationRows,
      error: conversationError,
    } = await supabase
      .from("conversations")
      .select("id,post_id")
      .in("id", conversationIds);

    if (conversationError) {
      console.error(
        "Inbox conversation error:",
        conversationError
      );

      setError(
        `Unable to load conversations: ${conversationError.message}`
      );

      return;
    }

    const myDeletedIds =
      await getMyDeletedMessageIds(
        currentUserId
      );

    const results: InboxConversation[] = [];

    for (const row of conversationRows || []) {
      let postTitle =
        "NagaSphere conversation";

      if (row.post_id) {
        const { data: post } =
          await supabase
            .from("posts")
            .select("title")
            .eq("id", row.post_id)
            .maybeSingle();

        if (post?.title) {
          postTitle = post.title;
        }
      }

      const {
        data: members,
        error: membersError,
      } = await supabase
        .from("conversation_members")
        .select("user_id")
        .eq("conversation_id", row.id);

      if (membersError) {
        console.error(
          "Conversation members error:",
          membersError
        );

        continue;
      }

      const otherId = (members || [])
        .map((member) => member.user_id)
        .find(
          (id) => id !== currentUserId
        );

      let otherName =
        "NagaSphere user";

      if (otherId) {
        const { data: profile } =
          await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", otherId)
            .maybeSingle();

        if (profile?.full_name) {
          otherName =
            profile.full_name;
        }
      }

      const {
        data: conversationMessages,
        error: latestError,
      } = await supabase
        .from("messages")
        .select(
          "id,conversation_id,sender_id,body,created_at,deleted_at,deleted_by"
        )
        .eq("conversation_id", row.id)
        .order("created_at", {
          ascending: false,
        });

      if (latestError) {
        console.error(
          "Latest message error:",
          latestError
        );
      }

      const latest =
        (conversationMessages || []).find(
          (message) =>
            !myDeletedIds.has(
              message.id
            )
        );

      results.push({
        id: row.id,
        postId: row.post_id,
        postTitle,
        otherName,
        latestMessage:
          latest?.body ||
          "No messages yet",
        latestMessageTime:
          latest?.created_at || null,
      });
    }

    results.sort((a, b) => {
      if (!a.latestMessageTime) return 1;
      if (!b.latestMessageTime) return -1;

      return (
        new Date(
          b.latestMessageTime
        ).getTime() -
        new Date(
          a.latestMessageTime
        ).getTime()
      );
    });

    setInbox(results);
  }

  async function loadConversation(
    currentUserId: string
  ) {
    if (!conversationId) {
      setConversation(null);
      setMessages([]);
      return;
    }

    const {
      data: membership,
      error: memberError,
    } = await supabase
      .from("conversation_members")
      .select("user_id")
      .eq(
        "conversation_id",
        conversationId
      );

    if (memberError) {
      console.error(
        "Membership error:",
        memberError
      );

      setError(
        `Unable to open this conversation: ${memberError.message}`
      );

      return;
    }

    const memberIds = (
      membership || []
    ).map(
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

    if (
      conversationError ||
      !conversationRow
    ) {
      console.error(
        "Conversation error:",
        conversationError
      );

      setError(
        "Conversation not found."
      );

      return;
    }

    let postTitle =
      "NagaSphere conversation";

    if (conversationRow.post_id) {
      const { data: post } =
        await supabase
          .from("posts")
          .select("title")
          .eq(
            "id",
            conversationRow.post_id
          )
          .maybeSingle();

      if (post?.title) {
        postTitle = post.title;
      }
    }

    let otherName =
      "NagaSphere user";

    if (otherId) {
      const { data: profile } =
        await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", otherId)
          .maybeSingle();

      if (profile?.full_name) {
        otherName =
          profile.full_name;
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
      .eq(
        "conversation_id",
        conversationId
      )
      .order("created_at", {
        ascending: true,
      });

    if (messagesError) {
      console.error(
        "Messages loading error:",
        messagesError
      );

      setError(
        `Unable to load messages: ${messagesError.message}`
      );

      return;
    }

    const myDeletedIds =
      await getMyDeletedMessageIds(
        currentUserId
      );

    const visibleMessages =
      (messageRows || []).filter(
        (message) =>
          !myDeletedIds.has(
            message.id
          )
      );

    setConversation({
      id: conversationId,
      postTitle,
      otherName,
    });

    setMessages(
      visibleMessages as Message[]
    );
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/auth");
        return;
      }

      if (!mounted) return;

      setUserId(user.id);

      await loadInbox(user.id);

      if (conversationId) {
        await loadConversation(
          user.id
        );
      }

      if (mounted) {
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [
    conversationId,
    router,
    supabase,
  ]);

  async function sendMessage() {
    const text = body.trim();

    if (!text) return;

    if (!conversationId) {
      setError(
        "No conversation was selected."
      );
      return;
    }

    if (sending) return;

    setSending(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError(
          "Your login session has expired. Please log in again."
        );

        setSending(false);
        return;
      }

      setUserId(user.id);

      const {
        data: memberCheck,
        error: memberError,
      } = await supabase
        .from("conversation_members")
        .select("user_id")
        .eq(
          "conversation_id",
          conversationId
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

      if (memberError) {
        setError(
          `Unable to verify the conversation: ${memberError.message}`
        );

        setSending(false);
        return;
      }

      if (!memberCheck) {
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
          conversation_id:
            conversationId,
          sender_id: user.id,
          body: text,
        })
        .select(
          "id,conversation_id,sender_id,body,created_at,deleted_at,deleted_by"
        )
        .single();

      if (insertError) {
        console.error(
          "Message insert error:",
          insertError
        );

        setError(
          `Message could not be sent: ${insertError.message}`
        );

        setSending(false);
        return;
      }

      if (!newMessage) {
        setError(
          "The message was not returned after sending."
        );

        setSending(false);
        return;
      }

      setMessages(
        (current) => [
          ...current,
          newMessage as Message,
        ]
      );

      setBody("");
      setSending(false);

      await loadInbox(user.id);
    } catch (err) {
      console.error(
        "Unexpected send error:",
        err
      );

      setError(
        err instanceof Error
          ? `Message could not be sent: ${err.message}`
          : "An unexpected error occurred while sending the message."
      );

      setSending(false);
    }
  }

  async function deleteForMe(
    messageId: string
  ) {
    if (
      !userId ||
      deletingMessageId
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this message from your view?"
      );

    if (!confirmed) return;

    setDeletingMessageId(
      messageId
    );
    setError("");

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("message_deletions")
        .insert({
          message_id: messageId,
          user_id: userId,
        });

      if (
        deleteError &&
        deleteError.code !==
          "23505"
      ) {
        throw deleteError;
      }

      setMessages(
        (current) =>
          current.filter(
            (message) =>
              message.id !==
              messageId
          )
      );

      await loadInbox(userId);
    } catch (err) {
      console.error(
        "Delete for me error:",
        err
      );

      setError(
        err instanceof Error
          ? `Message could not be deleted: ${err.message}`
          : "Message could not be deleted."
      );
    } finally {
      setDeletingMessageId(null);
    }
  }

  async function deleteForEveryone(
    messageId: string
  ) {
    if (
      !userId ||
      deletingMessageId
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this message for everyone? The message will be replaced with “Message deleted”. This is only available for 15 minutes after sending."
      );

    if (!confirmed) return;

    setDeletingMessageId(
      messageId
    );
    setError("");

    try {
      const {
        data,
        error: deleteError,
      } = await supabase.rpc(
        "delete_message_for_everyone",
        {
          p_message_id:
            messageId,
        }
      );

      if (deleteError) {
        throw deleteError;
      }

      if (!data) {
        setError(
          "This message can no longer be deleted for everyone. The 15-minute window may have expired."
        );

        return;
      }

      setMessages(
        (current) =>
          current.map(
            (message) =>
              message.id ===
              messageId
                ? {
                    ...message,
                    body: "[Message deleted]",
                    deleted_at:
                      new Date().toISOString(),
                    deleted_by:
                      userId,
                  }
                : message
          )
      );

      await loadInbox(userId);
    } catch (err) {
      console.error(
        "Delete for everyone error:",
        err
      );

      setError(
        err instanceof Error
          ? `Message could not be deleted for everyone: ${err.message}`
          : "Message could not be deleted for everyone."
      );
    } finally {
      setDeletingMessageId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#082623] p-4 sm:p-6">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center">
          <p className="text-sm text-white/80">
            Loading messages...
          </p>
        </div>
      </main>
    );
  }

  if (!conversationId) {
    return (
      <main className="min-h-screen bg-[#082623] px-4 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">

          <header className="mb-6 rounded-2xl border border-white/15 bg-white p-4 shadow-xl sm:p-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">

              <button
                type="button"
                onClick={() =>
                  router.push("/")
                }
                aria-label="Go to NagaSphere home"
                className="flex w-full items-center justify-center sm:w-auto sm:justify-start"
              >
                <img
                  src="/nagasphere-logo.png"
                  alt="NagaSphere"
                  className="block h-auto max-h-16 w-auto max-w-[210px] object-contain"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
                className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-black"
              >
                Dashboard
              </button>

            </div>
          </header>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Messages
            </h1>

            <p className="mt-1 text-sm text-white/70">
              Your conversations with NagaSphere buyers and sellers.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {inbox.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white p-8 text-center shadow-xl sm:p-10">
              <h2 className="text-lg font-semibold text-gray-900">
                No conversations yet
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                When someone contacts you about a listing,
                the conversation will appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/")
                }
                className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Browse NagaSphere
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {inbox.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/messages?conversation=${item.id}`
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white p-5 text-left shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-900">
                        {item.otherName}
                      </h2>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {item.postTitle}
                      </p>

                      <p className="mt-2 truncate text-sm text-gray-500">
                        {item.latestMessage}
                      </p>
                    </div>

                    {item.latestMessageTime && (
                      <span className="shrink-0 text-xs text-gray-400">
                        {new Date(
                          item.latestMessageTime
                        ).toLocaleDateString()}
                      </span>
                    )}

                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#082623] px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">

        <header className="mb-5 rounded-2xl border border-white/15 bg-white p-4 shadow-xl sm:p-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={() =>
                router.push("/")
              }
              aria-label="Go to NagaSphere home"
              className="flex w-full items-center justify-center sm:w-auto sm:justify-start"
            >
              <img
                src="/nagasphere-logo.png"
                alt="NagaSphere"
                className="block h-auto max-h-16 w-auto max-w-[210px] object-contain"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/messages"
                )
              }
              className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-black"
            >
              ← All Messages
            </button>

          </div>
        </header>

        <div className="mx-auto mb-4 w-full max-w-4xl rounded-2xl border border-white/10 bg-white p-5 shadow-xl sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Conversation
          </p>

          <h1 className="mt-1 text-xl font-bold text-gray-900">
            {conversation?.otherName ||
              "NagaSphere user"}
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            About:{" "}
            {conversation?.postTitle ||
              "Listing"}
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-4 w-full max-w-4xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:p-5">

          <div className="min-h-[420px]">

            {messages.length === 0 ? (
              <div className="flex min-h-[380px] items-center justify-center text-center text-sm text-gray-500">
                No messages yet. Start the conversation below.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(
                  (message) => {
                    const mine =
                      message.sender_id ===
                      userId;

                    const deletedForEveryone =
                      Boolean(
                        message.deleted_at
                      );

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          mine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="max-w-[88%] sm:max-w-[75%]">

                          <div
                            className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                              deletedForEveryone
                                ? "border border-gray-200 bg-gray-100 text-gray-500 italic"
                                : mine
                                  ? "bg-black text-white"
                                  : "border border-gray-200 bg-white text-gray-900"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">
                              {message.body}
                            </p>

                            <p
                              className={`mt-1 text-[11px] ${
                                deletedForEveryone
                                  ? "text-gray-400"
                                  : mine
                                    ? "text-gray-300"
                                    : "text-gray-500"
                              }`}
                            >
                              {new Date(
                                message.created_at
                              ).toLocaleString()}
                            </p>
                          </div>

                          {!deletedForEveryone && (
                            <div
                              className={`mt-1 flex flex-wrap gap-2 ${
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
                                  deleteForMe(
                                    message.id
                                  )
                                }
                                className="text-[11px] text-white/70 underline hover:text-white disabled:opacity-50"
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
                                  className="text-[11px] text-white/70 underline hover:text-white disabled:opacity-50"
                                >
                                  Delete for everyone
                                </button>
                              )}
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

          </div>

        </div>

        <div className="mx-auto mt-4 w-full max-w-4xl">
          <div className="flex w-full items-center gap-2 rounded-2xl border border-white/15 bg-white p-2 shadow-xl">

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
              className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-100"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={
                sending ||
                !body.trim()
              }
              className="shrink-0 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 sm:px-5"
            >
              {sending
                ? "Sending..."
                : "Send"}
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#082623] p-4 sm:p-6">
          <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center">
            <p className="text-sm text-white/80">
              Loading messages...
            </p>
          </div>
        </main>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
