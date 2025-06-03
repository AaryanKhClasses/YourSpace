'use client'

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react"
import Image from "next/image"
import { useState } from "react"

export default function Settings({ fileHandle }: { fileHandle: FileSystemFileHandle }) {
    const [spaceName, setSpaceName] = useState<string>("")
    const settingsModal = useDisclosure()

    const initSettings = async () => {
        const file = await fileHandle!.getFile()
        if (!file) return alert("No file uploaded.")
        let lines = await file.text().then(text => text.split('\n'))
        setSpaceName(lines[6].split('"')[1])
    }

    const handleSettingsSave = async () => {
        const file = await fileHandle!.getFile()
        if (!file) return alert("No file uploaded.")
        if (!spaceName) return alert("Please enter a space name.")
        let lines = await file.text().then(text => text.split('\n'))

        const writable: FileSystemWritableFileStream = await fileHandle!.createWritable()
        lines[6] = `- spaceName: "${spaceName}"`

        const _newText = lines.join("\n")
        await writable.write(_newText)
        await writable.close()
    }

    return <>
        <span className="flex flex-col cursor-pointer items-center" onClick={() => {settingsModal.onOpen(); initSettings()}}>
            <Image src="/settings.png" alt="Settings" width={50} height={50} />
            <p>Settings</p>
        </span>
        <Modal isOpen={settingsModal.isOpen} onOpenChange={settingsModal.onOpenChange} className="w-1/2 h-1/2 dark">
            <ModalContent>
                {onClose => <>
                    <ModalHeader className="text-xl">Settings</ModalHeader>
                    <ModalBody>
                        <Input label="Space Name" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} placeholder="Enter your space name" className="mb-4" />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={() => {handleSettingsSave(); onClose()}} className="bg-[#3A4353] text-white font-semibold text-base focus:outline-none border-none rounded-lg w-full">Save Settings</Button>
                    </ModalFooter>
                </>}
            </ModalContent>
        </Modal>
    </>
}