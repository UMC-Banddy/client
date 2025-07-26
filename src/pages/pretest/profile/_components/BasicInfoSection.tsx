import React, { useState } from "react";

interface BasicInfoSectionProps {
  name: string;
  age: string;
  gender: string;
  onNameChange?: (name: string) => void;
  onNameClear?: () => void;
  onAgeChange?: (age: string) => void;
  onGenderChange?: (gender: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  age,
  gender,
  onNameChange,
  onNameClear,
  onAgeChange,
  onGenderChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleNameSave = () => {
    onNameChange?.(tempName);
    setIsEditing(false);
  };

  const handleNameCancel = () => {
    setTempName(name);
    setIsEditing(false);
  };

  const handleNameClear = () => {
    setTempName("");
    onNameClear?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      handleNameCancel();
    }
  };

  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          {isEditing ? (
            <>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white border-none outline-none"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleNameSave}
                  className="text-green-400 hover:text-green-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNameCancel}
                  className="text-red-400 hover:text-red-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange?.(e.target.value)}
                className="w-full bg-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white border-none outline-none"
                placeholder="이름을 입력하세요"
              />
            </>
          )}
        </div>
        <button
          onClick={handleNameClear}
          className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-full transition-colors ml-4"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="border-b border-white mb-3"></div>
      <div className="flex items-center justify-start">
        <div className="flex items-center h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 2xl:h-18">
          <div
            className="bg-transparent text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-white border-none outline-none w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 2xl:w-18 p-0 m-0 text-left cursor-text flex items-center"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onAgeChange?.(e.currentTarget.textContent + "세")}
            style={{
              padding: 0,
              margin: 0,
              border: "none",
              outline: "none",
              minWidth: "fit-content",
              height: "100%",
            }}
          >
            {age.replace("세", "")}
          </div>
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-white flex items-center">
            세
          </span>
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-white mx-2 flex items-center">
            |
          </span>
          <select
            value={gender}
            onChange={(e) => onGenderChange?.(e.target.value)}
            className="bg-transparent text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-white border-none outline-none cursor-pointer flex items-center"
            style={{
              padding: 0,
              margin: 0,
              border: "none",
              outline: "none",
              height: "100%",
            }}
          >
            <option value="남성">남성</option>
            <option value="여성">여성</option>
            <option value="기타">기타</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
