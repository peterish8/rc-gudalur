"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase, type BoardMember } from "@/lib/supabase";

// BoardMemberCard component
const BoardMemberCard: React.FC<{ member: BoardMember }> = ({ member }) => {
  return (
    <div
      className="flex-shrink-0 w-64 sm:w-72 modern-card p-5 sm:p-6 text-center cursor-pointer hover:shadow-xl transition-shadow duration-300
                 bg-transparent rounded-lg shadow-md flex flex-col items-center justify-center"
    >
      <p className="text-emerald-600 font-bold text-base sm:text-lg mb-1">
        {member.designation}
      </p>
      <h3 className="font-montserrat font-bold text-lg sm:text-xl text-gray-900">
        {member.name}
      </h3>
    </div>
  );
};

export default function BoardMembers() {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const scrollRef3 = useRef<HTMLDivElement>(null);

  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch board members from Supabase
  useEffect(() => {
    fetchBoardMembers();
  }, []);

  const fetchBoardMembers = async () => {
    try {
      console.log("Fetching board members from Supabase...");
      const { data, error } = await supabase
        .from("board_members")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching board members:", error);
        setBoardMembers([]);
      } else {
        console.log(
          "Board members fetched successfully:",
          data?.length || 0,
          "members"
        );
        setBoardMembers(data || []);
      }
    } catch (error) {
      console.error("Network error fetching board members:", error);
      setBoardMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Organize members by section field (if available) or fallback to old logic
  const fixedMembers = boardMembers
    .filter((member) => member.section === "fixed")
    .slice(0, 3); // Limit to max 3 fixed members

  // Check if any members have section field set
  const hasSectionField = boardMembers.some((m) => m.section);

  let scrollingLayer1Members: BoardMember[] = [];
  let scrollingLayer2Members: BoardMember[] = [];
  let scrollingLayer3Members: BoardMember[] = [];

  if (hasSectionField) {
    // Use section field to organize
    scrollingLayer1Members = boardMembers.filter(
      (member) => member.section === "layer1"
    );
    scrollingLayer2Members = boardMembers.filter(
      (member) => member.section === "layer2"
    );
    scrollingLayer3Members = boardMembers.filter(
      (member) => member.section === "layer3"
    );
  } else {
    // Fallback: Use old logic (split by index for backward compatibility)
    const scrollingMembers = boardMembers.slice(3);
    scrollingLayer1Members = scrollingMembers.filter(
      (_, index) => index % 3 === 0
    );
    scrollingLayer2Members = scrollingMembers.filter(
      (_, index) => index % 3 === 1
    );
    scrollingLayer3Members = scrollingMembers.filter(
      (_, index) => index % 3 === 2
    );
  }

  // Duplicate members for seamless looping for each scrolling layer
  const duplicatedLayer1Members = [
    ...scrollingLayer1Members,
    ...scrollingLayer1Members,
    ...scrollingLayer1Members,
  ];
  const duplicatedLayer2Members = [
    ...scrollingLayer2Members,
    ...scrollingLayer2Members,
    ...scrollingLayer2Members,
  ];
  const duplicatedLayer3Members = [
    ...scrollingLayer3Members,
    ...scrollingLayer3Members,
    ...scrollingLayer3Members,
  ];

  // Effect to handle auto-scrolling for each row
  useEffect(() => {
    const setupScrolling = (
      ref: React.RefObject<HTMLDivElement>,
      direction: "normal" | "reverse",
      speed: string
    ) => {
      const scrollElement = ref.current;
      if (!scrollElement) return;

      // Reset animation to ensure it restarts correctly on prop changes or re-renders
      scrollElement.style.animation = "none";
      void scrollElement.offsetWidth; // Trigger reflow
      scrollElement.style.animation = "";

      scrollElement.style.animationDuration = speed;
      scrollElement.style.animationDirection = direction; // Use 'normal' or 'reverse' directly
      scrollElement.style.animationPlayState = "running"; // Ensure it's running by default
    };

    // Only set up scrolling if we have members loaded
    if (boardMembers.length === 0) return;

    // Row 1: Scrolls Left (normal direction for animate-scroll-right)
    setupScrolling(scrollRef1, "normal", "140s");
    // Row 2: Scrolls Right (reverse direction for animate-scroll-right)
    setupScrolling(scrollRef2, "reverse", "180s");
    // Row 3: Scrolls Left (normal direction for animate-scroll-right)
    setupScrolling(scrollRef3, "normal", "160s");

    // Cleanup function to pause animations when component unmounts
    return () => {
      if (scrollRef1.current)
        scrollRef1.current.style.animationPlayState = "paused";
      if (scrollRef2.current)
        scrollRef2.current.style.animationPlayState = "paused";
      if (scrollRef3.current)
        scrollRef3.current.style.animationPlayState = "paused";
    };
  }, [boardMembers]); // Re-run when boardMembers change

  return (
    <section
      id="board"
      className="py-20"
      style={{
        backgroundImage: 'url("/Our_Board_Members_bg.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        opacity: 0.8, // Adjust for subtlety
      }}
    >
      <div className="px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="grand-title font-montserrat font-black text-6xl mb-6 text-emerald-900">
            Our Board Members
          </h2>
          <p className="text-emerald-800 max-w-3xl mx-auto text-xl font-medium">
            Meet the dedicated leaders who guide our club's mission and
            initiatives
          </p>
        </div>

        {/* Rotary Strip Banner */}
        <div className="my-8">
          <Image
            src="/rotary-strip-banner.png"
            alt="Rotary Strip Banner"
            width={800}
            height={60}
            className="w-3/4 mx-auto object-cover"
          />
        </div>

        {/* Fixed Members Section */}
        {loading ? (
          <div className="flex justify-center mb-8">
            <p className="text-gray-600">Loading board members...</p>
          </div>
        ) : boardMembers.length === 0 ? (
          <div className="flex justify-center mb-8">
            <p className="text-gray-600">
              No board members found. Please add members in the admin panel.
            </p>
          </div>
        ) : (
          <div className="flex justify-center gap-5 mb-8 flex-wrap">
            {fixedMembers.length > 0 ? (
              fixedMembers.map((member) => (
                <BoardMemberCard key={member.id} member={member} />
              ))
            ) : (
              <p className="text-gray-600">
                No fixed members assigned. Add members with section="fixed" in
                admin.
              </p>
            )}
          </div>
        )}

        {/* Auto-scrolling for both Desktop and Mobile with Fade Effects */}
        {!loading &&
          (scrollingLayer1Members.length > 0 ||
            scrollingLayer2Members.length > 0 ||
            scrollingLayer3Members.length > 0) && (
            <div className="scroll-fade-container overflow-hidden py-4">
              {/* Row 1: Scrolls Left */}
              {scrollingLayer1Members.length > 0 && (
                <div
                  ref={scrollRef1}
                  className="flex gap-5 animate-scroll-right" // Custom animation for left scroll
                  style={{ width: "fit-content" }}
                >
                  {duplicatedLayer1Members.map((member, index) => (
                    <BoardMemberCard
                      key={`row1-${member.id}-${index}`}
                      member={member}
                    />
                  ))}
                </div>
              )}

              {/* Row 2: Scrolls Right */}
              {scrollingLayer2Members.length > 0 && (
                <div className="py-8">
                  {" "}
                  {/* Add some vertical spacing */}
                  <div
                    ref={scrollRef2}
                    className="flex gap-5 animate-scroll-right" // Existing animation for right scroll
                    style={{ width: "fit-content" }}
                  >
                    {duplicatedLayer2Members.map((member, index) => (
                      <BoardMemberCard
                        key={`row2-${member.id}-${index}`}
                        member={member}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Row 3: Scrolls Left */}
              {scrollingLayer3Members.length > 0 && (
                <div
                  ref={scrollRef3}
                  className="flex gap-5 animate-scroll-right" // Custom animation for left scroll
                  style={{ width: "fit-content" }}
                >
                  {duplicatedLayer3Members.map((member, index) => (
                    <BoardMemberCard
                      key={`row3-${member.id}-${index}`}
                      member={member}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
      </div>
    </section>
  );
}
