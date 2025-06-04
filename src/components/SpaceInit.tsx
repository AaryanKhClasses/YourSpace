'use client'

import { Button } from "@heroui/react"
import { version } from "@/../package.json"
import { useState } from "react"
import loadPlugins from "@/loadPlugins"

export default function SpaceInit() {
    // File Handling Functions
    const [fileName, setFileName] = useState<string>("No file chosen")
    const [load, setLoad] = useState(false)
    const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null)

    const handleUploadFile = async () => {
        try {
            // @ts-ignore
            const [fileHandler]: [FileSystemFileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: '.SPACEFILE files',
                    accept: { 'text/plain': ['.spacefile'] }
                }],
                excludeAcceptAllOption: false,
                multiple: false
            })

            const _file: File = await fileHandler.getFile()
            const _text: string = await _file.text()
            let lines = _text.split('\n')
            setFileHandle(fileHandler)

            if(!(_file &&
                lines[0] === "// DO NOT modify the contents of this file. It WILL corrupt your space.\r" &&
                lines[1] === "\r" &&
                lines[2].startsWith("start spacefile ") &&
                lines[lines.length - 1] === "end spacefile"
            )) return alert('Your .spacefile is corrupted.')

            const _name: string = lines[6].split('"')[1]
            setFileName(_name)
            setLoad(true)
            const _version: string = lines[2].split('"')[1]
            let _modules: string[] = lines[3].split('[')[1].replaceAll('", "', "\n").replaceAll('"', "").replace("]", "\n").split('\n')
            _modules = _modules.splice(0, _modules.length-1)

            const writable: FileSystemWritableFileStream = await fileHandler.createWritable()
            if(version != _version) lines[2] = `start spacefile "${version}"`

            const _newText = lines.join("\n")
            await writable.write(_newText)
            await writable.close()
        } catch(e) {
            console.error(e)
        }
    }

    return <div className="flex flex-col items-center h-screen pt-2 gap-2">
        <p className="text-3xl">Welcome to Your Space!</p>
        {load ? null : <p className="text-xl">Log in to your space by uploading the .spacefile below!</p>}
        <div className="flex items-center mt-2 w-3/4 rounded-lg overflow-hidden bg-[#2C3441]">
            <Button onPress={handleUploadFile} className="h-12 px-5 w-1/7 bg-[#3A4353] text-white font-semibold text-base focus:outline-none border-none rounded-l-lg" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>Choose File </Button>
            <input type="text" onClick={handleUploadFile} value={fileName} disabled className="cursor-pointer h-12 w-full px-4 bg-[#2C3441] text-[#A0AEC0] text-base border-none rounded-r-lg focus:outline-none" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} placeholder="No file chosen"/>
        </div>
        {load ? <div className="h-screen p-2 m-2 bg-[#c55850] rounded-lg w-full">
            <div className="flex flex-col w-fit items-center justify-center text-center">
                {loadPlugins(fileHandle!)}
            </div>
        </div> : null}
    </div>
}