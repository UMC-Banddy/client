import React from "react";
import styled from "@emotion/styled";

interface Tag {
  label: string;
  active?: boolean;
}

interface HomeTagSectionProps {
  tags: Tag[];
  className?: string;
}

const TagList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-x: auto;
  align-items: flex-end;
  padding-bottom: 0;
  margin-top: 0;
`;

const TagButton = styled.button<{ active?: boolean }>`
  border-radius: 9999px;
  padding: 6px 16px;
  font-size: 14px;
  font-family: "학교안심 바른돋움", "IBM Plex Sans KR", sans-serif;
  font-weight: 500;
  background: ${({ active }) => (active ? "#FF3B30" : "#232323")};
  color: ${({ active }) => (active ? "#fff" : "#8E8E93")};
  border: none;
  outline: none;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  &:focus {
    box-shadow: 0 0 0 2px #ff3b30;
  }
`;

const HomeTagSection = ({ tags, className = "" }: HomeTagSectionProps) => (
  <TagList className={className}>
    {tags.map((tag, i) => (
      <TagButton
        key={i}
        active={tag.active}
        tabIndex={0}
        aria-label={tag.label}
      >
        {tag.label}
      </TagButton>
    ))}
  </TagList>
);

export default HomeTagSection;
