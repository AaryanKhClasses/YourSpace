'use client'

import { Image, Navbar, NavbarBrand } from "@heroui/react"

export default function Appbar() {
    return <>
        <Navbar>
            <NavbarBrand className="flex flex-row items-center justify-center gap-2">
                <Image src="icon.png" alt="Logo" width={32} height={32} />
                <span className="text-xl">YourSpace&trade;</span>
            </NavbarBrand>
        </Navbar>
    </>
}