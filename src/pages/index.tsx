import React from "react";
import Layout from "@/components/Layout";
import TodoList from "@/components/TodoList";

const Home: React.FC = () => {
  return (
    <Layout>
      <TodoList />
    </Layout>
  );
};

export default Home;
