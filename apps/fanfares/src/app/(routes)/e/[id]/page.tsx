"use client"

import { getIdFromUrl } from "@/app/controllers/utils/formatting";
import { usePathname } from "next/navigation";
import { useEffect } from "react";


export default function Page() {

    const id = getIdFromUrl(usePathname())

    // ------------ USE EFFECTS ------------
  
    useEffect(() => {

    }, [id])

  return <div>Event Page: {id}</div>;
}