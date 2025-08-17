import React from "react";
import TestDriveLists from "./_components/test-drive-list";

const TestDrivePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test Drive Managment</h1>
      <TestDriveLists />
    </div>
  );
};

export default TestDrivePage;
