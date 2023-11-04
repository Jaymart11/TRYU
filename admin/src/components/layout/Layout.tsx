import React from "react";
interface WrapperProps {
  children: React.ReactNode;
}

const Layout = ({ children }: WrapperProps) => {
  const appBarWidth = "calc(100% - 240px)";
  return (
    <div
      style={{
        width: `${appBarWidth}`,
        marginTop: "74px",
        marginLeft: "239.2px",
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
