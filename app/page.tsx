"use client"

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    const res = await fetch('/rss')
    const data = await res.text()
    console.log(data)
  }

  return (
    <div>123</div>
  );
}
