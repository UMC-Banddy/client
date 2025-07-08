import React from "react";
import styled from "@emotion/styled";
import JoinButton from "@/shared/ui/atoms/JoinButton";

interface AlbumCardProps {
  image: string;
  title: string;
  description: string;
  hasNotification?: boolean;
  onJoin?: () => void;
  onLike?: () => void;
  onMute?: () => void;
  className?: string;
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-radius: 24px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.16);
  background: #1c1c1e;
  padding: 24px 20px 28px 20px;
  margin-top: 24px;
  width: 100%;
  max-width: 340px;
  position: relative;
`;

const ImageWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1.1/1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.04) inset,
    0 2px 16px 0 rgba(255, 255, 255, 0.08) inset;
  background: #232323;
`;

const AlbumImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  display: block;
`;

const NotificationDot = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #ff3b30;
  border-radius: 50%;
  z-index: 2;
`;

const Title = styled.h3`
  font-family: "학교안심 바른돋움", "IBM Plex Sans KR", sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  color: #fff;
  margin-bottom: 2px;
`;

const Desc = styled.p`
  font-family: "학교안심 바른돋움", "IBM Plex Sans KR", sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 1.5;
  color: #8e8e93;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const AlbumCard = ({
  image,
  title,
  description,
  hasNotification,
  onJoin,
  onLike,
  onMute,
  className = "",
}: AlbumCardProps) => {
  return (
    <Card className={className}>
      <ImageWrap>
        <AlbumImg
          src={image.startsWith("src/") ? image : `src/${image}`}
          alt={title}
          tabIndex={0}
          aria-label={title}
        />
        {hasNotification && <NotificationDot aria-label="새 알림" />}
      </ImageWrap>
      <Title>{title}</Title>
      <Desc>{description}</Desc>
      <Actions>
        <JoinButton onClick={onJoin} />
        {/* 좋아요/뮤트 등 추가 버튼은 필요시 배치 */}
      </Actions>
    </Card>
  );
};

export default AlbumCard;
