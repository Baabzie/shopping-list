import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Shopping-List</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
