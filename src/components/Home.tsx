'use client'

import { Button } from "@heroui/button"
import Link from "next/link"

export default function Home() {
    const handleCreateSpace = () => {
        const spaceFile = 'space.spacefile'
        const link = document.createElement('a')
        link.href = spaceFile
        link.download = 'space.spacefile'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        location.href = '/space'
    }

    return <div className="flex flex-col items-center h-screen justify-center">
        <p className="text-5xl mb-5 mt-[-100]">YourSpace&trade;</p>
        <p className="text-2xl">Your Own Virtual Space, stored locally and securely into your own device!</p>
        <p className="text-2xl">Try it out now by clicking the button!</p>
        <Button className="mt-4 text-xl" color="danger" onPress={handleCreateSpace}>Create a New Space Now!</Button>
        <Link href="/space" className="mt-4 text-xl text-[#FE5F55]">Already have a Space? Click here to access it!</Link>
    </div>
}