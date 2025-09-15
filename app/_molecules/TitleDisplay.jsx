// app/_molecules/TitleDisplay.jsx
"use client";
import { usePageEdit } from "../context/PageEditProvider";
import { Header1 } from "../_atoms/Headers";

export default function TitleDisplay() {
  const { title } = usePageEdit();
  return <Header1 className="mb-0 ">{title}</Header1>;
}
