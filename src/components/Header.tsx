"use client";
import { LucideArrowLeft, LucideChevronLeft, LucideMoveLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({
  title,
  hideBack = false,
}: {
  title: string;
  hideBack?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex w-full relative justify-center items-center p-4">
      {!hideBack && (
        <LucideChevronLeft
          className="h-full absolute rounded-md left-1 cursor-pointer"
          size={32}
          onClick={() => navigate(-1)}
        />
      )}{" "}
      <span className="text-title capitalize">{title}</span>
    </div>
  );
}
