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

            {/* LinkedIn Logo Button */}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-contact-btn"
                title={`Connect with ${name} on LinkedIn`}
                aria-label={`Visit ${name}'s LinkedIn profile`}
                onClick={(e) => e.stopPropagation()}
              >
                <FaLinkedin className="pc-linkedin-icon" />
              </a>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
