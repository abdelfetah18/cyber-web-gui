import React from "react";

export default function Header() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 8,
                paddingBottom: 8,
            }}
        >
            <div
                style={{
                    fontWeight: 600,
                    fontSize: 24,
                }}
            >Cyber <span style={{ color: "var(--primaryColor)" }}>Web</span></div>
        </div>
    )
}