'use client'

import { Button } from "@heroui/react"
import { useState } from "react"

export default function SpaceInit() {
    const [fileName, setFileName] = useState<string>("No file chosen")

    const handleUploadFile = async (e: any) => {
        console.log(e)
    }

    return <div className="flex flex-col items-center h-screen pt-2 gap-2">
        <p className="text-3xl">Welcome to Your Space!</p>
        <p className="text-xl">Log in to your space by uploading the .spacefile below!</p>
        <div className="flex items-center mt-2 w-3/4 rounded-lg overflow-hidden bg-[#2C3441]">
            <Button onPress={handleUploadFile} className="h-12 px-5 w-1/7 bg-[#3A4353] text-white font-semibold text-base focus:outline-none border-none rounded-l-lg" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>Choose File </Button>
            <input type="text" onClick={handleUploadFile} value={fileName} disabled className="cursor-pointer h-12 w-full px-4 bg-[#2C3441] text-[#A0AEC0] text-base border-none rounded-r-lg focus:outline-none" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} placeholder="No file chosen"/>
        </div>
    </div>
}