import React, { useState } from "react";
import { httpMessageTabs } from "../../utils/consts";
import HeadersList from "./HeadersList";

interface RequestProps {
    httpRequest: HttpRequest;
}

export default function Request({ httpRequest }: RequestProps) {
    const [selectedTab, setSelectedTab] = useState<HttpMessageTab>("raw");

    return (
        <div className="w-1/2 flex flex-col border-r overflow-hidden">
            <div className="py-2 px-4 border-b">Request</div>
            <div className="w-full flex items-center gap-2 m-2 h-10">
                {
                    httpMessageTabs.map((item: HttpMessageTab, index: number) => {
                        const selected = selectedTab == item;

                        return (
                            <div key={index} onClick={() => setSelectedTab(item)} className={`px-4 py-1 font-semibold text-xs rounded-full cursor-pointer active:scale-105 select-none duration-300 ${selected ? "bg-primaryColor text-white border border-primaryColor" : "text-gray-400 border"}`}>{item}</div>
                        )
                    })
                }
            </div>
            <div className="w-full whitespace-pre-line text-xs px-4 overflow-auto">
                {selectedTab == "raw" && (String.fromCharCode.apply(null, httpRequest.raw))}
                {selectedTab == "headers" && (<HeadersList headers={httpRequest.headers} />)}
                {selectedTab == "body" && (String.fromCharCode.apply(null, httpRequest.body))}
            </div>
        </div>
    )
}
