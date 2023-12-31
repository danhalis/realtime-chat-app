import AddFriendForm from "@/components/ui/friends/AddFriendForm";
import React from "react";

function AddFriendPage() {
  return (
    <main className="pt-8">
      <h1 className="text-5xl font-bold mb-8">Add a friend</h1>
      <AddFriendForm />
    </main>
  );
}

export default AddFriendPage;