import Button from "@/components/ui/Button";
import React from "react";

function DashboardPage() {
  return <pre>HELLO</pre>;
}

DashboardPage.auth = {
  // loading: <p>Authenticating ...</p>,
  redirect: "/signin",
};

export default DashboardPage;
