import AddFriendForm from "@/components/ui/AddFriendForm";
import React from "react";

function AddPage() {
  return (
    <main className="pt-8">
      <h1 className="text-5xl font-bold mb-8">Add a friend</h1>
      <AddFriendForm />
    </main>
  );
}

AddPage.auth = {
  // loading: <p>Authenticating ...</p>,
  redirect: "/signin",
};

export default AddPage;
