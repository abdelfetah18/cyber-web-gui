import React, { useState } from "react";
import { httpMessageTabs } from "../../utils/consts";
import HeadersList from "./HeadersList";

interface ResponseProps {
    httpResponse: HttpResponse;
};

export default function Response({ httpResponse }: ResponseProps) {
    const [selectedTab, setSelectedTab] = useState<HttpMessageTab>("raw");

    return (
        <div className="w-1/2 h-full flex flex-col overflow-hidden">
            <div className="py-2 px-4 border-b">Response</div>
            <div className="w-full flex items-center gap-2 m-2">
                {
                    httpMessageTabs.map((item: HttpMessageTab, index: number) => {
                        const selected = selectedTab == item;

                        return (
                            <div key={index} onClick={() => setSelectedTab(item)} className={`px-4 py-1 font-semibold text-xs rounded-full cursor-pointer active:scale-105 select-none duration-300 ${selected ? "bg-primaryColor text-white border border-primaryColor" : "text-gray-400 border"}`}>{item}</div>
                        )
                    })
                }
            </div>
            <div className="w-full flex-grow whitespace-pre-line text-xs px-4 overflow-auto">
                {selectedTab == "raw" && (String.fromCharCode.apply(null, httpResponse.raw))}
                {selectedTab == "headers" && (<HeadersList headers={httpResponse.headers} />)}
                {selectedTab == "body" && (String.fromCharCode.apply(null, httpResponse.body))}
            </div>
        </div>
    )
}