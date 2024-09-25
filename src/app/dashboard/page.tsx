"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SideBar";

export default function Dashboard() {
  return (
    <div className="flex">
      <div className="h-[100vh]">
        <Sidebar />
      </div>
      <div className="flex-1 p-10">
        <h1 className="text-xl font-bold mb-5">Client</h1>
      </div>
    </div>
  );
}
