import { ReactElement } from "react"
import * as Settings from "@/plugins/Settings"

const plugins = [Settings]

export default function loadPlugins(fileHandle: FileSystemFileHandle, props?: any): ReactElement[] {
    return plugins.map((plugin, idx) => {
        const PluginComponent = plugin.default as React.ComponentType<any>
        if (!PluginComponent) return null
        return <PluginComponent key={idx} fileHandle={fileHandle} {...props} />
    }).filter((el): el is ReactElement => el !== null)
}