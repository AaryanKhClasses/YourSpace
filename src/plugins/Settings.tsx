'use client'

import { pluginNames } from "@/loadPlugins"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, useDisclosure } from "@heroui/react"
import { SettingsIcon } from "lucide-react"
import { useState } from "react"

export default function Settings({ fileHandle }: { fileHandle: FileSystemFileHandle }) {
    const [spaceName, setSpaceName] = useState("")
    const settingsModal = useDisclosure()
    const [pluginStates, setPluginStates] = useState(() => pluginNames.map(() => false))

    const initSettings = async () => {
        const file = await fileHandle.getFile()
        if (!file) return alert("No file uploaded.")
        const text = await file.text()
        let lines = text.split('\n')

        setSpaceName(lines[6].split('"')[1])

        let _modules = lines[3].split('[')[1].replaceAll('", "', "\n").replaceAll('"', "").replace("]", "\n").split('\n')
        _modules = _modules.splice(0, _modules.length-1)

        pluginNames.map((plugin, index) => {
            lines.map((line, idx) => {
                if(line.includes(`module "${plugin.toLowerCase()}":`)) {
                    if(lines[idx+1] == `- disabled\r`) setPluginStates(states => {
                        const newStates = [...states]
                        newStates[index] = false
                        return newStates
                    })
                    else setPluginStates(states => {
                        const newStates = [...states]
                        newStates[index] = true
                        return newStates
                    })
                }
            })
        })
    }
    const handleSettingsSave = async () => {
        const file = await fileHandle.getFile()
        if (!file) return alert("No file uploaded.")
        if (!spaceName) return alert("Please enter a space name.")
        const text = await file.text()
        let lines = text.split('\n')

        let _modules = lines[3].split('[')[1].replaceAll('", "', "\n").replaceAll('"', "").replace("]", "\n").split('\n')
        _modules = _modules.splice(0, _modules.length-1)

        pluginNames.forEach((plugin, pIndex) => {
            const moduleName = plugin.toLowerCase()
            if (!_modules.includes(moduleName)) _modules.push(moduleName)
            const moduleLine = `module "${moduleName}":`

            let found = false
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(moduleLine)) {
                    found = true
                    if (pluginStates[pIndex] === false) {
                        if (lines[i + 1] && lines[i + 1].trim() !== '- disabled') lines.splice(i + 1, 0, '- disabled\r')
                        else if (!lines[i + 1]) lines.splice(i + 1, 0, '- disabled\r')
                    } else if (lines[i + 1] && lines[i + 1].trim() === '- disabled') lines.splice(i + 1, 1)
                    break
                }
            }
            if (!found) {
                const endIdx = lines.findIndex(l => l.trim() === 'end spacefile')
                if (endIdx !== -1) lines.splice(endIdx ,0 ,moduleLine ,pluginStates[pIndex] === false ? '- disabled\r' : '')
                else {
                    lines.push(moduleLine)
                    if (pluginStates[pIndex] === false) lines.push('- disabled\r')
                    lines.push('end spacefile')
                }
            }
        })
        for (let i = lines.length - 1; i > 0; i--) if (lines[i].trim() === '' && lines[i - 1].trim() === '') lines.splice(i, 1)
        const endIdx = lines.findIndex(l => l.trim() === 'end spacefile')
        if (endIdx > 0) {
            if (lines[endIdx - 1].trim() !== '') lines.splice(endIdx, 0, '')
            else {
            let i = endIdx - 2
            while (i >= 0 && lines[i].trim() === '') {
                lines.splice(i + 1, 1)
                i--
            }}
        }
        const writable = await fileHandle.createWritable()
        lines[6] = `- spaceName: "${spaceName}"`
        lines[3] = `modules [${_modules.map(mod => `"${mod}"`).join(', ')}]`

        const _newText = lines.join("\n")
        await writable.write(_newText)
        await writable.close()
    }

    return <>
        <span className="flex flex-col cursor-pointer items-center" onClick={() => {settingsModal.onOpen(); initSettings()}}>
            <SettingsIcon size="40" />
            <p>Settings</p>
        </span>
        <Modal isOpen={settingsModal.isOpen} onOpenChange={settingsModal.onOpenChange} className="w-1/2 h-1/2 dark">
            <ModalContent>
                {onClose => <>
                    <ModalHeader className="text-xl">Settings</ModalHeader>
                    <ModalBody>
                        <Input label="Space Name" value={spaceName} onChange={e => setSpaceName(e.target.value)} placeholder="Enter your space name" className="mb-4" />
                        <h2>Plugins Manager</h2>
                        {pluginNames.map((plugin, index) => (
                            <div key={index} className="flex items-center mb-2 gap-2">
                                <Switch
                                    isSelected={pluginStates[index]}
                                    onValueChange={() => setPluginStates(states => {
                                        const newStates = [...states]
                                        newStates[index] = !newStates[index]
                                        return newStates
                                    })}
                                />
                                {plugin}
                            </div>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={() => {handleSettingsSave(); onClose()}} className="bg-[#3A4353] text-white font-semibold text-base focus:outline-none border-none rounded-lg w-full">Save Settings</Button>
                    </ModalFooter>
                </>}
            </ModalContent>
        </Modal>
    </>
}