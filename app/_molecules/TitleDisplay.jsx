// app/_molecules/TitleDisplay.jsx
"use client";
import { usePageEdit } from "./PageEditProvider";
import { Header1 } from "../_atoms/Headers";

export default function TitleDisplay() {
  const { title } = usePageEdit();
  return <Header1 className="text-primary mb-0">{title}</Header1>;
}
