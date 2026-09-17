"use client";
import React, { useRef, useCallback } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";


interface ProfileCardProps {
  avatarUrl: string;
  iconUrl?: string;
  grainUrl?: string;
  className?: string;
  name?: string;
  title?: string;
  linkedinUrl?: string;
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = "/images/default-avatar.jpg",
  iconUrl,
  grainUrl,
  className = "",
  name = "Ankit Khandelwal",
  title = "P",
  linkedinUrl,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLinkedInClick = useCallback(() => {
    if (linkedinUrl) {
      window.open(linkedinUrl, "_blank");
    }
  }, [linkedinUrl]);

  const cardStyle = {
    "--icon": iconUrl ? `url(${iconUrl})` : "none",
    "--grain": grainUrl ? `url(${grainUrl})` : "none",
  } as React.CSSProperties;

  return (
    <div className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      <section ref={cardRef} className="pc-card">
        {/* Avatar fills the card */}
        <div className="pc-avatar-content">
          <img
            className="avatar"
            src={avatarUrl}
            alt={`${name || "User"} avatar`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/default-avatar.jpg";
            }}
          />

          {/* Info overlay */}
          {/* Info overlay at bottom */}
          <div className="pc-user-info">
            <div className="pc-user-details">
              {/* Mini avatar inside the frosted box */}
              {/* User text (name + status) */}
              <div className="pc-user-text">
                <div className="pc-handle">{name}</div>
                <div className="pc-status">{title}</div>{" "}
                {/* Fixed: Use title prop instead of hardcoded "President" */}
              </div>
            </div>

            {/* Button (similar to "+ Add Member") */}
            {linkedinUrl && (
              <button
                className="pc-contact-btn"
                onClick={handleLinkedInClick}
                type="button"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
