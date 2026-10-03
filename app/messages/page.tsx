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

  async function loadInbox(currentUserId: string) {
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

    const results: InboxConversation[] = [];

    for (const row of conversationRows || []) {
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

      let otherName = "NagaSphere user";

      if (otherId) {
        const { data: profile } =
          await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", otherId)
            .maybeSingle();

        if (profile?.full_name) {
          otherName = profile.full_name;
        }
      }

      const {
        data: latestMessages,
        error: latestError,
      } = await supabase
        .from("messages")
        .select(
          "id,conversation_id,sender_id,body,created_at"
        )
        .eq("conversation_id", row.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(1);

      if (latestError) {
        console.error(
          "Latest message error:",
          latestError
        );
      }

      const latest =
        latestMessages?.[0];

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
      .eq("conversation_id", conversationId);

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
    ).map((member) => member.user_id);

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

      setError("Conversation not found.");
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
        "id,conversation_id,sender_id,body,created_at"
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

    setConversation({
      id: conversationId,
      postTitle,
      otherName,
    });

    setMessages(
      messageRows || []
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
        .eq("user_id", user.id)
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
          "id,conversation_id,sender_id,body,created_at"
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

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-600">
            Loading messages...
          </p>
        </div>
      </main>
    );
  }

  if (!conversationId) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">

          <header className="mb-6 flex items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm">
            <button
              type="button"
              onClick={() => router.push("/")}
              aria-label="Go to NagaSphere home"
              className="flex items-center"
            >
              <img
                src="/nagasphere-logo.png"
                alt="NagaSphere"
                className="block h-auto w-[150px]"
              />
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              Dashboard
            </button>
          </header>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Messages
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Your conversations with NagaSphere buyers and sellers.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {inbox.length === 0 ? (
            <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
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
                className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
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
                  className="w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md"
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
    <main className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">

        <header className="mb-5 flex items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Go to NagaSphere home"
            className="flex items-center"
          >
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              className="block h-auto w-[150px]"
            />
          </button>

          <button
            type="button"
            onClick={() => router.push("/messages")}
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← All Messages
          </button>
        </header>

        <div className="mb-4 rounded-2xl border bg-white p-5 shadow-sm">
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
              {messages.map(
                (message) => {
                  const mine =
                    message.sender_id ===
                    userId;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        mine
                          ? "justify-end"
                          : "justify-start"
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
                }
              )}
            </div>
          )}

        </div>

        <div className="mt-4 flex gap-2">

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
            className="min-w-0 flex-1 rounded-xl border px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-100"
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={
              sending ||
              !body.trim()
            }
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {sending
              ? "Sending..."
              : "Send"}
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
