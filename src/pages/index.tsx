import React from "react";
import Layout from "@/components/Layout";
import ItemsList from "@/components/ItemsList";

const Home: React.FC = () => {
  return (
    <Layout>
      <ItemsList />
    </Layout>
  );
};

export default Home;
