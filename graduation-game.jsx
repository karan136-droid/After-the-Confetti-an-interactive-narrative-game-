import { useState, useEffect, useRef } from "react";

const FRIENDS = [
  {
    id: "maya",
    name: "Maya",
    path: "Corporate Consulting",
    emoji: "📊",
    color: "#C8956C",
    accent: "#F2C98A",
    bio: "Has three final-round interviews lined up. Rehearses answers in the mirror every night.",
    anxietyLine: "What if they think I'm not polished enough?",
  },
  {
    id: "dev",
    name: "Dev",
    path: "Tech Roles",
    emoji: "💻",
    color: "#6C8EC8",
    accent: "#8AB4F2",
    bio: "Applied to 47 companies. Refreshes his portal every 12 minutes. Has Leetcode nightmares.",
    anxietyLine: "Everyone else already has an offer. What am I doing wrong?",
  },
  {
    id: "priya",
    name: "Priya",
    path: "Grad School",
    emoji: "📚",
    color: "#8E6CC8",
    accent: "#B88AF2",
    bio: "Waiting on 6 PhD applications. Rewrites her personal statement for the 9th time.",
    anxietyLine: "What if I'm not actually smart enough for this?",
  },
  {
    id: "jordan",
    name: "Jordan",
    path: "Startup Life",
    emoji: "🚀",
    color: "#6CC89A",
    accent: "#8AF2C0",
    bio: "Building an EdTech idea with a sketchy co-founder. Parents are not thrilled.",
    anxietyLine: "Everyone thinks I'm being reckless. Maybe they're right.",
  },
  {
    id: "sam",
    name: "Sam",
    path: "Still Figuring It Out",
    emoji: "🌀",
    color: "#C86C6C",
    accent: "#F28A8A",
    bio: "Genuinely doesn't know what they want. Gets asked every family dinner. Still doesn't know.",
    anxietyLine: "Is something wrong with me? Everyone else has a plan.",
  },
];

const STORY_BEATS = [
  {
    id: "start",
    type: "scene",
    title: "Six Weeks After Graduation",
    text: "The confetti has long settled. The caps are in storage boxes. And the group chat — once buzzing with graduation countdowns — has gone weirdly quiet.\n\nEveryone's home. Everyone's applying. Everyone's pretending they're fine.",
    choices: [{ label: "Begin the story →", next: "choose_friend" }],
  },
  {
    id: "choose_friend",
    type: "choose_friend",
    title: "Who are you following?",
    text: "Choose a friend to walk alongside — their fears, their late nights, their small wins.",
  },
  {
    id: "midnight",
    type: "scene",
    title: "2:47 AM",
    text: (friend) =>
      `{name}'s laptop glows in the dark. The resume has been edited 11 times tonight.\n\n"${friend.anxietyLine}"\n\nThe cursor blinks. Delete. Retype. Delete again.\n\nThe group chat notification pops up. Someone's awake too.`,
    choices: [{ label: "Open the group chat", next: "group_chat_1" }],
  },
  {
    id: "group_chat_1",
    type: "chat",
    title: "The Group Chat",
    messages: [
      { sender: "dev", text: "anyone else up" },
      { sender: "maya", text: "unfortunately" },
      { sender: "priya", text: "yes. rewriting my SOP for the 9th time" },
      { sender: "sam", text: "I've been staring at a blank Indeed page for an hour" },
      { sender: "jordan", text: "my parents called AGAIN. asked if I had a 'real job' yet" },
      { sender: "dev", text: "I have 47 applications out. FORTY SEVEN. zero responses" },
      { sender: "maya", text: "I had a final round interview and I totally froze on the case study" },
      { sender: "sam", text: "…so we're all disasters" },
      { sender: "priya", text: "apparently" },
      { sender: "jordan", text: "cool cool cool cool" },
    ],
    choices: [{ label: "Two weeks later →", next: "rejection" }],
  },
  {
    id: "rejection",
    type: "scene",
    title: "The Email Nobody Wanted",
    text: (friend) => {
      const rejections = {
        maya: `Subject: Re: Associate Consultant Position\n\n"After careful consideration, we have decided to move forward with other candidates..."\n\n{name} reads it three times. Then closes the laptop. Then opens it again.\n\nHer LinkedIn is full of people announcing offers.`,
        dev: `Portal Status Update: Application Reviewed\n\n"We appreciate your interest but will not be moving forward at this time."\n\nThat's rejection #23. Dev screenshots it. Adds it to the folder he calls "The Wall."`,
        priya: `"We regret to inform you that your application to our PhD program..."\n\nFirst school. Out of six. {name} stares at the ceiling for forty minutes.`,
        jordan: `The co-founder texts: "I think I need to step back from the project."\n\n{name} built the entire MVP. Alone. For three months.\n\nThe startup idea is suddenly very quiet.`,
        sam: `{name} doesn't get a rejection email. They just… haven't heard anything.\n\nSilence is its own kind of answer.`,
      };
      return rejections[friend?.id] || rejections["sam"];
    },
    choices: [{ label: "The spiral begins", next: "spiral" }],
  },
  {
    id: "spiral",
    type: "scene",
    title: "The Spiral",
    text: (friend) =>
      `Three weeks of this.\n\n{name} checks the application portal every morning before brushing their teeth. Goes on LinkedIn and immediately regrets it. Someone from sophomore year just got promoted to Associate. Someone else is moving to New York for a job that sounds impossibly cool.\n\n"I'm 22," {name} thinks. "And I'm already behind."\n\nThe thought is so heavy it's almost funny.\n\nAlmost.`,
    choices: [{ label: "The call that changes everything →", next: "the_call" }],
  },
  {
    id: "the_call",
    type: "scene",
    title: "Friday Night, Priya Calls Everyone",
    text: 'It\'s 8 PM on a Friday and Priya does something nobody expected.\n\nShe starts a video call. All five of them.\n\n"I need to see your actual faces," she says. "Not your LinkedIn profiles. Not your status updates. You."\n\nFor a second, nobody talks.\n\nThen Sam says: "I look terrible."\n\nAnd Jordan says: "Same."\n\nAnd Maya laughs — a real laugh — for the first time in two weeks.',
    choices: [{ label: "The conversation they needed", next: "real_talk" }],
  },
  {
    id: "real_talk",
    type: "chat",
    title: "The Real Conversation",
    messages: [
      { sender: "priya", text: "Okay. Real talk. How is everyone actually doing. No 'I'm fine.'" },
      { sender: "maya", text: "Honestly? I cry a little every time I get a LinkedIn notification" },
      { sender: "dev", text: "I've been measuring my worth in offer letters and I have zero so" },
      { sender: "sam", text: "I feel like I missed a meeting where everyone got assigned their futures and I just… wasn't there" },
      { sender: "jordan", text: "My co-founder quit. I didn't tell anyone. I was too embarrassed" },
      { sender: "priya", text: "Jordan!! why didn't you say something" },
      { sender: "jordan", text: "because you all have REAL problems and I chose this" },
      { sender: "maya", text: "Your problems are real problems" },
      { sender: "dev", text: "Can I say something kind of obvious that I keep forgetting" },
      { sender: "sam", text: "please" },
      { sender: "dev", text: "We graduated in May. It is JULY. We have been adults for like 8 weeks." },
      { sender: "maya", text: "…oh" },
      { sender: "priya", text: "We're acting like we're 35 and behind schedule" },
      { sender: "sam", text: "I genuinely forgot that we just started" },
      { sender: "jordan", text: "LinkedIn is a disease" },
      { sender: "maya", text: "THE WORST DISEASE" },
    ],
    choices: [{ label: "The truth about timelines →", next: "timelines" }],
  },
  {
    id: "timelines",
    type: "wisdom",
    title: "What Priya Said Next",
    speaker: "priya",
    quote:
      "There is no timeline. I looked it up — actually looked it up. The average person changes careers SEVEN times. Seven. My aunt got her master's at 34. My dad's best friend started his company at 41. We are comparing our chapter one to someone else's chapter seven and wondering why the plot feels thin.",
    response: "The call goes quiet. Not an uncomfortable quiet. A thinking quiet.",
    choices: [{ label: "Dev adds something →", next: "rejection_redirect" }],
  },
  {
    id: "rejection_redirect",
    type: "wisdom",
    title: "What Dev Said",
    speaker: "dev",
    quote:
      "Okay but also — I've been keeping score on my rejections. Like literally tracking them. And here's what I found: every time I got a no from somewhere that felt wrong, something slightly more right showed up. I don't know if that's real or just cope. But. Maybe rejection is just... redirection? Like a GPS rerouting.",
    response: "\"GPS rerouting,\" Maya repeats slowly. \"I'm going to think about that every time I get a rejection email now.\"",
    choices: [{ label: "Sam says the thing →", next: "sam_moment" }],
  },
  {
    id: "sam_moment",
    type: "wisdom",
    title: "What Sam Finally Said",
    speaker: "sam",
    quote:
      "I think I've been ashamed of not knowing. Like not having a plan is a personality flaw. But maybe... not knowing means I haven't settled yet? Like I'm still holding out for something that actually fits. That's not failure. That's just... still looking.",
    response:
      "Jordan: \"Okay that was genuinely wise.\"\nSam: \"Don't. I'll start crying.\"\nJordan: \"Me too honestly.\"",
    choices: [{ label: "Then Maya says the thing they all needed →", next: "laugh" }],
  },
  {
    id: "laugh",
    type: "scene",
    title: "The Moment They Laughed",
    text: "Maya goes quiet for a second. Then:\n\n\"Can we just acknowledge that we have been absolutely UNHINGED about this?\"\n\nDev: \"47 applications.\"\nMaya: \"I wore a blazer to a Zoom interview and then stood up and was wearing pajama pants.\"\nPriya: \"I rewrote my personal statement NINE TIMES.\"\nJordan: \"I learned to code in one weekend to fix something my co-founder broke.\"\nSam: \"I made a pros and cons list for becoming a lighthouse keeper.\"\n\nAll five of them are laughing so hard the video call starts glitching.\n\nIt feels like breathing for the first time in weeks.",
    choices: [{ label: "The ending →", next: "ending" }],
  },
  {
    id: "ending",
    type: "ending",
    title: "Different Paths. None of Them Lost.",
    text: "The call ends around midnight.\n\nNothing is resolved, exactly. Maya still doesn't have an offer. Dev's wall of rejections is still there. Priya's waiting. Jordan's rebuilding alone. Sam still doesn't have a plan.\n\nBut something shifted.\n\nThey stopped performing okay at each other.\n\nThey remembered that careers are not a race — they're a wander. That success doesn't arrive on a schedule. That the most honest thing you can do at 22 is admit you're figuring it out.\n\nBecause everyone is.\n\nEven the ones who look like they're not.",
    epilogues: [
      { friend: "maya", text: "Maya got a smaller offer from a firm she actually liked. She took it." },
      { friend: "dev", text: "Dev got rejection #31. Then #32. Then an interview for something he actually wanted." },
      { friend: "priya", text: "Priya got into two programs. She chose the one that scared her more." },
      { friend: "jordan", text: "Jordan rebuilt the startup with a new co-founder. It's still small. It's hers." },
      { friend: "sam", text: "Sam took a job that's fine. They're still looking. That's okay too." },
    ],
  },
];

const FRIEND_MAP = Object.fromEntries(FRIENDS.map((f) => [f.id, f]));

const chatBubbleStyle = (isPlayer, color) => ({
  alignSelf: isPlayer ? "flex-end" : "flex-start",
  background: isPlayer ? color : "rgba(255,255,255,0.06)",
  color: isPlayer ? "#1a1410" : "#e8ddd0",
  borderRadius: isPlayer ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
  padding: "10px 16px",
  maxWidth: "78%",
  fontSize: "0.9rem",
  lineHeight: 1.5,
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
});

export default function App() {
  const [beat, setBeat] = useState("start");
  const [friend, setFriend] = useState(null);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showChoice, setShowChoice] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const chatEndRef = useRef(null);

  const currentBeat = STORY_BEATS.find((b) => b.id === beat);

  useEffect(() => {
    if (currentBeat?.type === "chat") {
      setVisibleMessages(0);
      setShowChoice(false);
      const msgs = currentBeat.messages;
      msgs.forEach((_, i) => {
        setTimeout(() => {
          setVisibleMessages(i + 1);
          if (i === msgs.length - 1) {
            setTimeout(() => setShowChoice(true), 600);
          }
        }, i * 700 + 300);
      });
    }
  }, [beat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  const resolveText = (text) => {
    if (!text) return "";
    const resolved = typeof text === "function" ? text(friend) : text;
    return resolved.replace(/\{name\}/g, friend?.name || "They");
  };

  const advance = (next) => {
    setGlitch(true);
    setTimeout(() => {
      setGlitch(false);
      if (next === "choose_friend") {
        setBeat("choose_friend");
      } else {
        setBeat(next);
      }
    }, 200);
  };

  const selectFriend = (f) => {
    setFriend(f);
    advance("midnight");
  };

  const restart = () => {
    setFriend(null);
    setBeat("start");
  };

  const fc = friend?.color || "#C8956C";
  const fa = friend?.accent || "#F2C98A";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0c09",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: "#e8ddd0",
        padding: "0 16px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background: `radial-gradient(ellipse, ${fc}18 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 1s ease",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-300px",
          right: "-100px",
          width: "500px",
          height: "500px",
          background: `radial-gradient(ellipse, ${fa}0d 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          padding: "24px 0 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8a7a6a", textTransform: "uppercase", marginBottom: "2px" }}>
            An Interactive Story
          </div>
          <div style={{ fontSize: "1.1rem", fontStyle: "italic", color: fa }}>
            After the Confetti
          </div>
        </div>
        {friend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${fc}40`,
              borderRadius: "20px",
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "0.8rem",
              color: "#a0907e",
            }}
            onClick={restart}
          >
            <span>{friend.emoji}</span>
            <span>{friend.name}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          position: "relative",
          zIndex: 1,
          opacity: glitch ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        {/* SCENE */}
        {currentBeat?.type === "scene" && (
          <SceneCard beat={currentBeat} resolveText={resolveText} fc={fc} fa={fa} advance={advance} />
        )}

        {/* CHOOSE FRIEND */}
        {currentBeat?.type === "choose_friend" && (
          <div>
            <div
              style={{
                fontSize: "1.4rem",
                fontStyle: "italic",
                color: "#e8ddd0",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}
            >
              Who are you following?
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "#8a7a6a",
                marginBottom: "32px",
                lineHeight: 1.6,
              }}
            >
              Choose a friend to walk alongside through the chaos.
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {FRIENDS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => selectFriend(f)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${f.color}35`,
                    borderRadius: "12px",
                    padding: "16px 20px",
                    color: "#e8ddd0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${f.color}15`;
                    e.currentTarget.style.borderColor = `${f.color}70`;
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = `${f.color}35`;
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ fontSize: "1.8rem", lineHeight: 1 }}>{f.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "1rem", fontWeight: "600", color: f.accent }}>{f.name}</span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: f.color,
                          background: `${f.color}20`,
                          borderRadius: "4px",
                          padding: "2px 6px",
                        }}
                      >
                        {f.path}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.83rem", color: "#9a8a7a", lineHeight: 1.5 }}>{f.bio}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHAT */}
        {currentBeat?.type === "chat" && (
          <div>
            <div style={{ marginBottom: "4px", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6a5a4a" }}>
              Group Chat · 5 members
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                padding: "20px 16px",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                minHeight: "300px",
              }}
            >
              {currentBeat.messages.slice(0, visibleMessages).map((msg, i) => {
                const sender = FRIEND_MAP[msg.sender];
                const isPlayer = friend && msg.sender === friend.id;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isPlayer ? "flex-end" : "flex-start",
                      animation: "fadeSlide 0.3s ease",
                    }}
                  >
                    {!isPlayer && (
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: sender?.color || "#8a7a6a",
                          marginBottom: "3px",
                          paddingLeft: "12px",
                        }}
                      >
                        {sender?.name || msg.sender}
                      </div>
                    )}
                    <div style={chatBubbleStyle(isPlayer, fc)}>{msg.text}</div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            {showChoice && currentBeat.choices?.map((c) => (
              <ChoiceButton key={c.next} label={c.label} fc={fc} fa={fa} onClick={() => advance(c.next)} />
            ))}
          </div>
        )}

        {/* WISDOM */}
        {currentBeat?.type === "wisdom" && (
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6a5a4a", marginBottom: "20px" }}>
              {currentBeat.title}
            </div>
            <div
              style={{
                borderLeft: `3px solid ${FRIEND_MAP[currentBeat.speaker]?.color || fc}`,
                paddingLeft: "20px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: FRIEND_MAP[currentBeat.speaker]?.accent || fa,
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {FRIEND_MAP[currentBeat.speaker]?.emoji} {FRIEND_MAP[currentBeat.speaker]?.name} says:
              </div>
              <div
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.75,
                  color: "#e8ddd0",
                  fontStyle: "italic",
                }}
              >
                "{currentBeat.quote}"
              </div>
            </div>
            <div
              style={{
                fontSize: "0.88rem",
                color: "#9a8a7a",
                lineHeight: 1.7,
                marginBottom: "28px",
                whiteSpace: "pre-line",
              }}
            >
              {currentBeat.response}
            </div>
            {currentBeat.choices?.map((c) => (
              <ChoiceButton key={c.next} label={c.label} fc={fc} fa={fa} onClick={() => advance(c.next)} />
            ))}
          </div>
        )}

        {/* ENDING */}
        {currentBeat?.type === "ending" && (
          <div>
            <div
              style={{
                fontSize: "1.4rem",
                fontStyle: "italic",
                color: fa,
                marginBottom: "20px",
                lineHeight: 1.4,
              }}
            >
              {currentBeat.title}
            </div>
            <div
              style={{
                fontSize: "0.92rem",
                color: "#c0b0a0",
                lineHeight: 1.85,
                marginBottom: "36px",
                whiteSpace: "pre-line",
              }}
            >
              {currentBeat.text}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#6a5a4a",
                  marginBottom: "16px",
                }}
              >
                One Year Later
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {currentBeat.epilogues.map((ep) => {
                  const f = FRIEND_MAP[ep.friend];
                  const isMe = friend && ep.friend === friend.id;
                  return (
                    <div
                      key={ep.friend}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        padding: isMe ? "10px" : "0",
                        background: isMe ? `${f.color}15` : "transparent",
                        borderRadius: isMe ? "8px" : "0",
                        border: isMe ? `1px solid ${f.color}30` : "none",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{f.emoji}</span>
                      <div>
                        <span style={{ fontSize: "0.78rem", color: f.accent, marginRight: "6px", fontWeight: 600 }}>
                          {f.name}
                        </span>
                        <span style={{ fontSize: "0.83rem", color: "#a09080", lineHeight: 1.5 }}>{ep.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "32px 20px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "1.3rem",
                  fontStyle: "italic",
                  color: fa,
                  marginBottom: "8px",
                  lineHeight: 1.5,
                }}
              >
                "Different paths.
                <br />
                None of them lost."
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6a5a4a", marginBottom: "28px" }}>
                — a reminder you'll probably need again someday
              </div>
              <button
                onClick={restart}
                style={{
                  background: "transparent",
                  border: `1px solid ${fc}50`,
                  borderRadius: "8px",
                  padding: "10px 24px",
                  color: "#a09080",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${fc}15`;
                  e.currentTarget.style.color = fa;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#a09080";
                }}
              >
                Play again as someone else
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function SceneCard({ beat, resolveText, fc, fa, advance }) {
  return (
    <div>
      <div
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#6a5a4a",
          marginBottom: "12px",
        }}
      >
        {beat.title}
      </div>
      <div
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.9,
          color: "#c8b8a8",
          whiteSpace: "pre-line",
          marginBottom: "36px",
        }}
      >
        {resolveText(beat.text)}
      </div>
      {beat.choices?.map((c) => (
        <ChoiceButton key={c.next} label={c.label} fc={fc} fa={fa} onClick={() => advance(c.next)} />
      ))}
    </div>
  );
}

function ChoiceButton({ label, fc, fa, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: `${fc}18`,
        border: `1px solid ${fc}50`,
        borderRadius: "8px",
        padding: "12px 22px",
        color: fa,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "0.88rem",
        letterSpacing: "0.03em",
        transition: "all 0.2s ease",
        display: "block",
        width: "100%",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${fc}30`;
        e.currentTarget.style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${fc}18`;
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      {label}
    </button>
  );
}
