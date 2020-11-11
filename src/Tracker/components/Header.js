import React from "react";

const Header = ({ children }) => {
  return (
    <header className="header" style={{ position: "relative", zIndex: "1000" }}>
      {children}
    </header>
  );
};

export default Header;
