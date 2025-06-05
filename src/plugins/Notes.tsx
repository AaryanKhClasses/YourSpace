'use client'

import { NotebookPen, Plus } from "lucide-react"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from "@heroui/react"
import { useState } from "react"
import { pluginNames } from "@/loadPlugins"

export default function Notes({ fileHandle }: { fileHandle: FileSystemFileHandle }) {
    const notesModal = useDisclosure()
    const newNoteModal = useDisclosure()

    const [newNoteTitle, setNewNoteTitle] = useState("")
    const [newNoteContent, setNewNoteContent] = useState("")

    const [noteTitles, setNoteTitles] = useState<string[]>([])
    const [noteContents, setNoteContents] = useState<string[]>([])
    const [isEditing, setIsEditing] = useState(false)

    const initNotes = async () => {
        const file = await fileHandle.getFile()
        if (!file) return alert("No file uploaded.")
        const text = await file.text()
        let lines = text.split('\n')

        let _modules: string[] = lines[3].split('[')[1].replaceAll('", "', "\n").replaceAll('"', "").replace("]", "\n").split('\n')
        _modules = _modules.splice(0, _modules.length-1)
        let isEnabled = true
        lines.map((line: string, idx: number) => {
            if(line.includes(`module "notes":`) && lines[idx+1].includes('- disabled')) isEnabled = false
        })
        
        if(!_modules.includes("notes") || !isEnabled) return alert("Notes module is not enabled. To use notes, enable it using the settings menu!")

        let titles: string[] = []
        let contents: string[] = []
        lines.forEach((line, index) => {
            if (line.startsWith('- title:')) {
                const title = line.split('"')[1]
                titles.push(title)
                const contentLine = lines[index + 1]
                if (contentLine && contentLine.startsWith('  content:')) {
                    const content = contentLine.split('"')[1].replaceAll('\\n', '\n')
                    contents.push(content)
                } else {
                    contents.push("")
                }
            }
        })
        setNoteTitles(titles)
        setNoteContents(contents)
        notesModal.onOpen()
    }

    const handleNewNoteSave = async () => {
        const file = await fileHandle.getFile()
        if (!file) return alert("No file uploaded.")
        if (!newNoteTitle || !newNoteContent) return alert("Please enter a note title and content.")

        const text = await file.text()
        let lines = text.split('\n')

        let found = false
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('- title:') && lines[i].includes(`"${newNoteTitle}"`)) {
                if (lines[i + 1] && lines[i + 1].startsWith('  content:')) {
                    lines[i + 1] = `  content: "${newNoteContent.replaceAll('\n', '\\n')}"`
                } else lines.splice(i + 1, 0, `  content: "${newNoteContent.replaceAll('\n', '\\n')}"`)
                found = true
                break
            }
        }

        if (!found) {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i] === 'module "notes":') {
                    lines.splice(i + 1, 0, `- title: "${newNoteTitle}"`)
                    lines.splice(i + 2, 0, `  content: "${newNoteContent.replaceAll('\n', '\\n')}"`)
                    lines.splice(i + 3, 0, '')
                    break
                }
            }
        }

        const newText = lines.join('\n')
        const writable = await fileHandle.createWritable()
        await writable.write(newText)
        await writable.close()

        setNewNoteTitle("")
        setNewNoteContent("")
        setIsEditing(false)
        initNotes()
    }

    const handleOpenExistingNote = (index: number) => {
        setNewNoteTitle(noteTitles[index])
        setNewNoteContent(noteContents[index])
        setIsEditing(true)
        newNoteModal.onOpen()
    }

    return <>
        <span className="flex flex-col cursor-pointer items-center" onClick={initNotes}>
            <NotebookPen size="40" />
            <p>Notes</p>
        </span>
        <Modal isOpen={notesModal.isOpen} onOpenChange={notesModal.onOpenChange} className="w-1/2 h-1/2 dark">
            <ModalContent>
                {onClose => <div className="p-2">
                    <ModalHeader>Notes</ModalHeader>
                    {noteTitles.length != 0 && <div className="mb-4">
                            {noteTitles.map((title, index) => (
                                <Button key={index} className="bg-[#3A4353] my-1 text-white font-semibold text-base focus:outline-none border-none rounded-lg w-full" onPress={() => handleOpenExistingNote(index)}>{title}</Button>
                            ))}
                        </div>}
                    <Button className="bg-[#3A4353] text-white font-semibold text-base focus:outline-none border-none rounded-lg w-full" onPress={() => {newNoteModal.onOpen()}}><Plus /> New Note</Button>
                </div>}
            </ModalContent>
        </Modal>
        <Modal isOpen={newNoteModal.isOpen} onOpenChange={newNoteModal.onOpenChange} className="w-1/2 h-1/2 dark">
            <ModalContent>
                {onClose => <>
                    <ModalHeader>Create New Note</ModalHeader>
                    <ModalBody>
                        <Input label="Note Title" placeholder="Enter note title" value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} className="mb-4" disabled={isEditing} />
                        <Textarea label="Note Content" placeholder="Enter note content" value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} maxRows={5} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={() => {handleNewNoteSave(); onClose()}} className="bg-[#3A4353] text-white font-semibold text-base focus:outline-none border-none rounded-lg w-full">Save Note</Button>
                    </ModalFooter>
                </>}
            </ModalContent>
        </Modal>
    </>
}