"use client";

import dynamic from "next/dynamic";

const CreateServerModal = dynamic(() => import("./CreateServerModal"), {
  ssr: false,
});

const ModalsContainer = () => {
  return <CreateServerModal />;
};

export default ModalsContainer;
