import React, { useState } from "react";

type PressableProps = {
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const CustomButton: React.FC<PressableProps> = ({
  onPress,
  children,
  className,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPress}
      onKeyDown={(e) => e.key === "Enter" && onPress()}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        opacity: isPressed ? 0.7 : 1,
        cursor: "pointer",
        userSelect: "none",
        transition: "opacity 0.2s",
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default CustomButton;
